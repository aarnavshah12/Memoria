import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Title, RadioButton, Text } from 'react-native-paper';
import { ImageBackground } from 'react-native';

const backgroundImage = require('../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');
const assessmentQuestions = [
  { id: 1, question: "How often do you forget recent conversations or events?", options: [
      { value: "1", label: "Rarely or never" },
      { value: "2", label: "Occasionally (1-2 times a month)" },
      { value: "3", label: "Frequently (weekly)" },
      { value: "4", label: "Very frequently (daily)" }
    ] },
  { id: 2, question: "Do you have difficulty finding the right words during conversations?", options: [
      { value: "1", label: "Rarely or never" },
      { value: "2", label: "Sometimes" },
      { value: "3", label: "Often" },
      { value: "4", label: "Very often" }
    ] },
  { id: 3, question: "How often do you misplace important items?", options: [
      { value: "1", label: "Rarely" },
      { value: "2", label: "Monthly" },
      { value: "3", label: "Weekly" },
      { value: "4", label: "Daily" }
    ] },
  { id: 4, question: "Do you have trouble remembering appointments or commitments?", options: [
      { value: "1", label: "Almost never" },
      { value: "2", label: "Occasionally" },
      { value: "3", label: "Frequently" },
      { value: "4", label: "Almost always" }
    ] },
  { id: 5, question: "How often do you feel disoriented in familiar places?", options: [
      { value: "1", label: "Never" },
      { value: "2", label: "Rarely" },
      { value: "3", label: "Sometimes" },
      { value: "4", label: "Often" }
    ] }
];

const AssessmentQuestions = () => {
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentQuestionIndex]);

  const handleNext = () => {
    if (!assessmentAnswers[assessmentQuestions[currentQuestionIndex].id]) return;
    
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      });
    } else {
      setShowResult(true);
    }
  };

  const calculateResult = () => {
    const totalScore = Object.values(assessmentAnswers).reduce((acc, val) => acc + parseInt(val), 0);
    if (totalScore <= 5) return "🟢 Low risk for Alzheimer's - Your memory seems strong. Keep maintaining a healthy lifestyle with proper sleep, diet, and mental exercises.";
    if (totalScore <= 10) return "🟠 Moderate risk for Alzheimer's - Some memory concerns exist. Consider engaging in brain-stimulating activities, regular exercise, and consulting a professional if symptoms persist.";
    return "🔴 High risk for Alzheimer's - Frequent memory issues detected. It is recommended to consult a healthcare professional for further assessment and potential preventive measures.";
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        {!showResult ? (
          <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}> 
            <Title style={styles.title}>{assessmentQuestions[currentQuestionIndex].question}</Title>
            <RadioButton.Group
              value={assessmentAnswers[assessmentQuestions[currentQuestionIndex].id]}
              onValueChange={(value) =>
                setAssessmentAnswers(prev => ({ ...prev, [assessmentQuestions[currentQuestionIndex].id]: value }))
              }
            >
              {assessmentQuestions[currentQuestionIndex].options.map((option) => (
                <View key={option.value} style={styles.radioOption}>
                  <RadioButton value={option.value} />
                  <Text style={styles.optionText}>{option.label}</Text>
                </View>
              ))}
            </RadioButton.Group>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>{currentQuestionIndex < assessmentQuestions.length - 1 ? "Next" : "See Results"}</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.resultContainer}>
            <Title style={styles.title}>Assessment Result</Title>
            <Text style={styles.resultText}>{calculateResult()}</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      },
    container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  questionContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default AssessmentQuestions;