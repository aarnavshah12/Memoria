from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

# Load BLIP processor and model
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Function to generate captions for an image
def generate_caption(image_path):
    try:
        # Open the image
        image = Image.open(image_path).convert("RGB")
        
        # Process the image and prepare input for the model
        inputs = processor(images=image, return_tensors="pt")
        
        # Generate caption
        outputs = model.generate(**inputs)
        caption = processor.decode(outputs[0], skip_special_tokens=True)
        
        return caption
    except Exception as e:
        return f"Error processing image: {e}"

# Provide the path to your image
image_path = "alzeimers\IMG_9787.JPG"  # Replace with the path to your image

# Generate and print the caption
caption = generate_caption(image_path)
print(f"Generated Caption: {caption}")
