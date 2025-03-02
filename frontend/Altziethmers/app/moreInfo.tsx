import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { Card, Title, Paragraph, List, Surface, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper'; // Add this import at the top of your file


const AlzheimerQuotes = [
  "Alzheimer's is not just about memory loss. It's about the loss of self.",
  "Every person with Alzheimer's has a unique story to tell.",
  "The greatest gift you can give someone with Alzheimer's is your time and understanding.",
  "Early detection allows for better care and planning.",
  "Supporting Alzheimer's research today helps create a better tomorrow.",
  "Memory fades, but love remains forever."
];

const backgroundImage = require('../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');

export default function HomeScreen() {
  const [currentQuote, setCurrentQuote] = useState(AlzheimerQuotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * AlzheimerQuotes.length);
      setCurrentQuote(AlzheimerQuotes[randomIndex]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Title style={styles.title}>Understanding & Supporting</Title>
          <Paragraph style={styles.subtitle}>
            Working together to fight Alzheimer's disease
          </Paragraph>
        </View>

        <Surface style={styles.quoteSurface}>
          <Text style={styles.quote}>{currentQuote}</Text>
        </Surface>

        <Card style={styles.warningCard}>
          <Card.Content>
            <View style={styles.warningHeader}>
              <MaterialCommunityIcons name="alert" size={24} color="#ef4444" />
              <Title style={styles.warningTitle}>Warning Signs</Title>
            </View>
            <Paragraph>
              If you or a loved one experiences persistent memory loss or cognitive changes,
              consult a healthcare provider for proper evaluation.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.mainCard}>
          <Card.Content>
            <Title>Understanding Alzheimer's</Title>
            <List.Accordion title="What is Alzheimer's Disease?" left={props => <List.Icon {...props} icon="brain" />}>
              <List.Item description="Alzheimer's disease is a progressive brain disorder that slowly destroys memory and thinking skills." />
            </List.Accordion>
            <List.Accordion title="Key Warning Signs" left={props => <List.Icon {...props} icon="alert-circle" />}>
              <List.Item description="Memory loss affecting daily activities. Difficulty planning or solving problems. Confusion with time or place. Problems with words in speaking or writing. Changes in mood and personality" descriptionNumberOfLines={10} />
            </List.Accordion>
            <List.Accordion title="Prevention & Brain Health" left={props => <List.Icon {...props} icon="heart" />}>
              <List.Item description="Regular physical exercise. Social engagement and mental stimulation. Healthy diet rich in omega-3 fatty acids. Quality sleep habits. Stress management" descriptionNumberOfLines={10} />
            </List.Accordion>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard}>
          <Card.Content>
            <Title>Take Action</Title>

            <Link href="/CognitiveAssessment" style={styles.button}>
              <Text style={styles.buttonText}>Take Memory Assessment Test</Text>
            </Link>

            <Paragraph style={styles.buttonDescription}>
              Our interactive assessment includes both memory games and cognitive questionnaires
              to help understand your memory health.
            </Paragraph>

            <Link href="/MemoryGame" style={styles.button}>
              <Text style={styles.buttonText}>Play Memory Game</Text>
            </Link>
          </Card.Content>
        </Card>

        <Card style={styles.supportCard}>
          <Card.Content>
            <Title>Support & Resources</Title>
            <View style={styles.resourceLinks}>
              <Title style={styles.resourcesTitle}>Educational Resources</Title>
              <Button mode="text" onPress={() => Linking.openURL('https://www.alz.org')} icon="open-in-new">
                Alzheimer's Association
              </Button>
              <Button mode="text" onPress={() => Linking.openURL('https://www.nia.nih.gov/health/alzheimers')} icon="open-in-new">
                National Institute on Aging
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2B2E63', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#4c51ab', textAlign: 'center' },
  quoteSurface: { margin: 16, padding: 16, elevation: 4, backgroundColor: '#f3e8ff', borderRadius: 8 },
  quote: { fontSize: 18, fontStyle: 'italic', textAlign: 'center', color: '#6750A4' },
  warningCard: { margin: 16, backgroundColor: '#fef2f2' },
  warningHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  warningTitle: { color: '#ef4444', marginLeft: 8 },
  mainCard: { margin: 16 },
  actionCard: { margin: 16 },
  supportCard: { margin: 16 },
  button: {
    marginTop: 20,
    backgroundColor: '#6a11cb',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDescription: { marginTop: 8, fontSize: 14, color: '#666' },
  resourceLinks: { marginTop: 16 },
  resourcesTitle: { fontSize: 18, marginBottom: 8 },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
