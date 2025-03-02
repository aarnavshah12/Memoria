from flask import Flask, render_template, url_for, request, redirect, current_app, jsonify, Response
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import functions
import email_verification
from werkzeug.utils import secure_filename
import os
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image as PILImage
import io
import base64
import google.generativeai as genai
from flask_migrate import Migrate

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
genai.configure(api_key=os.getenv("APIKEY"))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
CORS(app)

class Accounts(db.Model):
    # __tablename__ = 'account'  # Use 'account' here
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), nullable=False, unique=True)
    username = db.Column(db.String(200), nullable=False, unique=True)
    password_hash = db.Column(db.String(256), nullable=False)
    is_verified = db.Column(db.Boolean, default=True)
    verification_code = db.Column(db.String(6), nullable=True)

    def set_verification_code(self, code):
        self.verification_code = code

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<Account name: {self.username}, id: {self.id}>'

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    image = db.Column(db.LargeBinary, nullable=False)
    caption = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    time = db.Column(db.Time, nullable=False, default=datetime.utcnow().time())
    # place = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=True)

    def __repr__(self):
        return f'<Image {self.id} - {self.date}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'account_id': self.account_id,
            'image': self.image,
            'caption': self.caption,
            'date': self.date.strftime('%Y-%m-%d'),
            'time': self.time.strftime('%H:%M:%S'),
        }


class DaySummary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today, unique=False)
    summary = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Summary {self.date}: {self.summary[:30]}...>'


def generate_summary(account_id, date):
    images = Image.query.filter_by(account_id=account_id, date=date).all()
    captions = [image.caption for image in images]
    prompt = f"Summarize the following captions in a concise and meaningful way: {captions}"
    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
    print(response)
    return response.text if response else "No summary available."


class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    place_name = db.Column(db.String(150), nullable=False)
    # city_and_country = db.Column(db.String(150), nullable=True)
    address = db.Column(db.String(300), nullable=False)

# class Images(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     account_id = db.Column(db.Integer, nullable=False)
#     image = db.Column(db.String(200), nullable=False)
#     date_created = db.Column(db.DateTime, default=datetime.utcnow)

#     def __repr__(self):
#         return f'<Image name: {self.image}, id: {self.id}>'

class ForumPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)  # Correct foreign key reference
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Post {self.id} - {self.title[:30]}>'


class ForumComment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('forum_post.id'), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    parent_comment_id = db.Column(db.Integer, db.ForeignKey('forum_comment.id'), nullable=True)  # New field
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Comment {self.id} - Post {self.post_id} - Parent {self.parent_comment_id}>'



@app.route('/create_post', methods=['POST'])
def create_post():
    data = request.get_json()

    # Validate request data
    if not all(k in data for k in ['account_id', 'title', 'content']):
        return jsonify({'error': 'Missing fields'}), 400

    new_post = ForumPost(
        account_id=data['account_id'],
        title=data['title'],
        content=data['content']
    )

    db.session.add(new_post)
    db.session.commit()
    
    return jsonify({'message': 'Post created successfully', 'post_id': new_post.id})

@app.route('/get_posts', methods=['GET'])
def get_posts():
    posts = ForumPost.query.order_by(ForumPost.date_created.desc()).all()
    
    post_list = [{
        'id': post.id,
        'account_id': post.account_id,
        'title': post.title,  # Ensure title is included
        'content': post.content,
        'date_created': post.date_created.strftime('%Y-%m-%d %H:%M:%S')  # Format timestamp
    } for post in posts]

    return jsonify({'posts': post_list})



@app.route('/add_comment', methods=['POST'])
def add_comment():
    data = request.get_json()

    if not all(k in data for k in ['post_id', 'account_id', 'content']):
        return jsonify({'error': 'Missing fields'}), 400

    new_comment = ForumComment(
        post_id=data['post_id'],
        account_id=data['account_id'],
        content=data['content'],
        parent_comment_id=data.get('parent_comment_id')  # Allows nested replies
    )

    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify({'message': 'Comment added successfully', 'comment_id': new_comment.id})


@app.route('/get_comments/<int:post_id>', methods=['GET'])
def get_comments(post_id):
    comments = ForumComment.query.filter_by(post_id=post_id).order_by(ForumComment.date_created.asc()).all()
    
    comment_list = [{
        'id': comment.id,
        'account_id': comment.account_id,
        'content': comment.content,
        'date_created': comment.date_created.strftime('%Y-%m-%d %H:%M:%S'),
        'parent_comment_id': comment.parent_comment_id  # Include parent info
    } for comment in comments]

    return jsonify({'comments': comment_list})


@app.route('/', methods=['POST', 'GET'])
def index():
    return jsonify({'message': 'some random page'})
    
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    # user_code = data.get('code')
    correct_code = functions.generate_code()
    subject, body = email_verification.send_verification_code(correct_code)
    functions.send_email(email, subject, body)
    # functions.check_code(user_code, correct_code)

    # Check if email already exists
    existing_account = Accounts.query.filter_by(email=email).first()
    if existing_account:
        return jsonify({'message': 'Email is already in use'}), 400

    # Check if username already exists (optional)
    existing_username = Accounts.query.filter_by(username=username).first()
    if existing_username:
        return jsonify({'message': 'Username is already taken'}), 400

    # Create new account
    new_account = Accounts(email=email, username=username, is_verified=False)
    new_account.set_password(password)
    new_account.set_verification_code(correct_code)
    
    try:
        db.session.add(new_account)
        db.session.commit()
        return jsonify({'message': 'Account created successfully', "id": new_account.id})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to create account'}), 500    
    
@app.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    account_id = data.get('account_id')
    user_code = data.get('input_code')
    account = Accounts.query.filter_by(id=account_id).first()
    print('user_code', user_code, type(user_code))
    print('account.verification_code: ', account.verification_code, type(account.verification_code))
    if not account.verification_code:
        return jsonify({'message': 'No verification code found'}), 404
    if user_code != account.verification_code:
        print(account.verification_code)
        return jsonify({'message': 'Invalid verification code'}), 401
    else:
        account.is_verified = True
        db.session.commit()
        return jsonify({'message': 'Account verified successfully', 'id': account.id, 'email': account.email, 'username': account.username}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if account exists in the database
    account = Accounts.query.filter_by(email=email).first()
    if account is None:
        return jsonify({'message': 'Account does not exist. Please sign up first.'}), 404

    # Check if the provided password is correct
    if not account.check_password(password):
        return jsonify({'message': 'Invalid username or password'}), 401
    
    if not account.is_verified:
        return jsonify({'message': 'Account not verified. Please check your email for the verification code.'}), 401

    return jsonify({'message': 'Login successful', "id": account.id, "username": account.username})


processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
@app.route('/make_image', methods=['POST'])
def make_image():
    try:
        # Ensure the request contains form-data
        if 'image' not in request.files:
            return jsonify({"error": "Missing image file"}), 400   
        if 'account_id' not in request.form:
            return jsonify({"error": "Missing account_id"}), 400

        # Get account_id from form data
        account_id = int(request.form.get('account_id'))

        # Read the image from the form-data request
        image_file = request.files.get('image')
        image_binary = image_file.read()
        # image = PILImage.open(io.BytesIO(image_file.read())).convert("RGB")

        # Generate caption using BLIP
        image = PILImage.open(io.BytesIO(image_binary)).convert("RGB")
        inputs = processor(images=image, return_tensors="pt")
        outputs = model.generate(**inputs)
        caption = processor.decode(outputs[0], skip_special_tokens=True)

        # Save image file to server
        image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
        image.save(image_path)  # Save image in uploads folder

        # Store metadata in database
        new_image = Image(account_id=account_id, image=image_binary, caption=caption)
        db.session.add(new_image)
        db.session.commit()

        return jsonify({'message': 'Image added successfully', "image_id": new_image.id, "caption": caption})

    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to add image', "error": str(e)}), 500
    
@app.route('/get_images', methods=['POST'])
def get_images():
    try:
        Date = request.get_json().get('date')
        date_object = datetime.strptime(Date, '%Y-%m-%d').date()
        print('date_object', date_object)
        account_id = int(request.get_json().get('id'))
        test = Image.query.filter_by(account_id=account_id, date=date_object).all()
        print(test)
        if test:
            print('test', test)
            print('test', test[0].date)
            print('test', test[0].date == date_object)
        test2 = Image.query.filter_by(date=date_object).all()
        if test2:
            print('test2', test2)
        images = Image.query.filter_by(date=date_object, account_id=account_id).all()
        if images:
            # Create a list of dictionaries containing image data, caption, date, and time
            image_data_list = [
                {
                    'id': image.id,
                    'image': base64.b64encode(image.image).decode('utf-8'),  # Convert binary image to base64
                    'caption': image.caption,  # Assuming the Image model has a 'caption' field
                    'date': image.date.strftime('%Y-%m-%d'),  # Format the date
                    'time': image.time.strftime('%H:%M:%S') if image.time else None  # Format time if it exists
                }
                for image in images
            ]
            
            return jsonify({'images': image_data_list})  # Return JSON response

        else:
            return jsonify({'message': 'No images found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get images', "error": str(e)}), 500
    
    
@app.route('/get_images_all', methods=['POST'])
def get_images_all():
    try:
        account_id = int(request.get_json().get('id'))
        test = Image.query.filter_by(account_id=account_id).all()
        print('test', test)
        images = Image.query.filter_by(account_id=account_id).all()
        if images:
            # Create a list of dictionaries containing image data, caption, date, and time
            image_data_list = [
                {
                    'image': base64.b64encode(image.image).decode('utf-8'),  # Convert binary image to base64
                    'caption': image.caption,  # Assuming the Image model has a 'caption' field
                    'date': image.date.strftime('%Y-%m-%d'),  # Format the date
                    'time': image.time.strftime('%H:%M:%S') if image.time else None  # Format time if it exists
                }
                for image in images
            ]
            
            return jsonify({'images': image_data_list})  # Return JSON response

        else:
            return jsonify({'message': 'No images found'}), 404

    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get images', "error": str(e)}), 500

@app.route('/delete_image', methods=['POST'])
def delete_image():
    try:
        data = request.get_json()
        image_id = data.get('image_id')

        if not image_id:
            return jsonify({"error": "Missing image_id"}), 400

        # Convert to integer (if it's not already)
        image_id = int(image_id)

        image = Image.query.filter_by(id = image_id).first()

        if not image:
            return jsonify({"error": "Image not found"}), 404

        db.session.delete(image)
        db.session.commit()

        return jsonify({"message": "Image deleted successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"message": "Failed to delete image", "error": str(e)}), 500

@app.route('/get_summary', methods=['GET'])
def get_summary():
    try:
        account_id = request.args.get('account_id', type=int)
        date_str = request.args.get('date')
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
        summary = DaySummary.query.filter_by(account_id=account_id, date=date_obj).first()
        
        if summary:
            return jsonify({'summary': summary.summary})
        else:
            return jsonify({'summary': "No summary available for this date."})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500   
    

@app.route('/create_place', methods=['POST'])
def create_place():
    try:
        data = request.get_json()
        account_id = data.get('account_id')
        name = data.get('place_name')
        # city_and_country = data.get('city_and_country')
        address = data.get('address')
        if not name:
            return jsonify({'message': 'Name is required'}), 400
        if not account_id:
            return jsonify({'message': 'Account ID is required'}), 400
        if not address:
            return jsonify({'message': 'Address is required'}), 400
        if Place.query.filter_by(account_id=account_id, place_name=name, address=address).first():
            return jsonify({'message': 'Place already exists'}), 400

        new_place = Place(account_id=account_id, place_name=name, address=address)
        db.session.add(new_place)
        db.session.commit()
        return jsonify({'message': 'Place created successfully', 'id': new_place.id})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to create place', 'error': str(e)}), 500
    

@app.route('/check_place', methods=['POST'])
def check_place():
    try:
        data = request.get_json()
        account_id = data.get('account_id')
        place_name = data.get('place_name')
        address = data.get('address')
        place = Place.query.filter_by(account_id=account_id, place_name=place_name, address=address).first()
        if place:
            print('Place exists')
            return jsonify({'message': 'Place exists', 'id': place.id})
        else:
            print('Place does not exist')
            return jsonify({'message': 'Place does not exist'})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to check place', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)



# from backend import app, db, Accounts

# with app.app_context():
#     db.create_all()
#     Accounts.__table__.drop(db.engine)  



