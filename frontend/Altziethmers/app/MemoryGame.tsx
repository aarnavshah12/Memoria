// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
// import ConfettiCannon from 'react-native-confetti-cannon';
// import { ImageBackground } from 'react-native';
// const symbols = ['🧠', '❤️', '⭐', '🌟', '💡', '🎯', '🎨', '🎭'];
// const cardSize = 90;
// const backgroundImage = require('../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');
// const MemoryGame = () => {
//   const [cards, setCards] = useState([]);
//   const [flippedCards, setFlippedCards] = useState([]);
//   const [matches, setMatches] = useState(0);
//   const [moves, setMoves] = useState(0);
//   const [showConfetti, setShowConfetti] = useState(false);

//   useEffect(() => {
//     initializeGame();
//   }, []);

//   const initializeGame = () => {
//     const duplicatedSymbols = [...symbols, ...symbols];
//     const shuffledCards = duplicatedSymbols
//       .sort(() => Math.random() - 0.5)
//       .map((symbol, index) => ({
//         id: index,
//         symbol,
//         isFlipped: true,
//         isMatched: false,
//         animation: new Animated.Value(0),
//       }));
//     setCards(shuffledCards);
//     setFlippedCards([]);
//     setMatches(0);
//     setMoves(0);
//     setShowConfetti(false);
//     setTimeout(() => {
//       setCards(prevCards => prevCards.map(card => ({ ...card, isFlipped: false })));
//     }, 2000);
//   };

//   const flipCard = (id) => {
//     const newCards = [...cards];
//     const card = newCards[id];
//     if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

//     Animated.timing(card.animation, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();

//     card.isFlipped = true;
//     setFlippedCards([...flippedCards, id]);
//   };

//   useEffect(() => {
//     if (flippedCards.length === 2) {
//       setMoves(moves + 1);
//       const [firstCard, secondCard] = flippedCards;

//       if (cards[firstCard].symbol === cards[secondCard].symbol) {
//         setMatches(matches + 1);
//         setCards(prevCards => prevCards.map(card =>
//           card.id === firstCard || card.id === secondCard
//             ? { ...card, isMatched: true }
//             : card
//         ));
//         setFlippedCards([]);
//       } else {
//         setTimeout(() => {
//           setCards(prevCards => prevCards.map(card =>
//             flippedCards.includes(card.id)
//               ? { ...card, isFlipped: false }
//               : card
//           ));
//           setFlippedCards([]);
//         }, 1000);
//       }
//     }
//   }, [flippedCards]);

//   useEffect(() => {
//     if (matches === symbols.length) {
//       setShowConfetti(true);
//     }
//   }, [matches]);

//   return (
//     <ImageBackground source={backgroundImage} style={styles.background}>
//     <View style={styles.container}>
//       <Text style={styles.title}>Memory Game</Text>
//       <Text style={styles.stats}>Moves: {moves} | Matches: {matches}/{symbols.length}</Text>
//       <View style={styles.grid}>
//         {cards.map((card) => {
//           return (
//             <TouchableOpacity key={card.id} onPress={() => flipCard(card.id)}>
//               <Animated.View style={[styles.card, card.isFlipped || card.isMatched ? styles.cardFlipped : styles.cardBack]}> 
//                 <Text style={styles.cardText}>{card.isFlipped || card.isMatched ? card.symbol : '?'}</Text>
//               </Animated.View>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//       <TouchableOpacity onPress={initializeGame} style={styles.resetButton}>
//         <Text style={styles.resetText}>Restart Game</Text>
//       </TouchableOpacity>
//       {showConfetti && <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} />}
//     </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//     background: {
//         flex: 1,
//         resizeMode: 'cover',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//         height: '100%',
//       },
//   container: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 10,
//   },
//   stats: {
//     fontSize: 18,
//     color: '#000',
//     marginBottom: 15,
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   card: {
//     width: cardSize,
//     height: cardSize,
//     margin: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     backfaceVisibility: 'hidden',
//     shadowColor: '#bbb',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//     elevation: 6, 
//   },
//   cardBack: {
//     backgroundColor: '#dde1e7',
//   },
//   cardFlipped: {
//     backgroundColor: '#fff',
//     borderColor: '#333',
//     borderWidth: 2,
//   },
//   cardText: {
//     fontSize: 30,
//     color: '#333',
//   },
//   resetButton: {
//     marginTop: 20,
//     backgroundColor: '#ff6b6b',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//   },
//   resetText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
// });

// export default MemoryGame;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { ImageBackground } from 'react-native';

const symbols = ['🧠', '❤️', '⭐', '🌟', '💡', '🎯', '🎨', '🎭'];
const cardSize = 90;
const backgroundImage = require('../assets/images/abstract-background-gradient-abstract-modern-background-for-mobile-apps-free-vector.jpg');

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const duplicatedSymbols = [...symbols, ...symbols];
    const shuffledCards = duplicatedSymbols
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: true,
        isMatched: false,
        animation: new Animated.Value(0),
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setShowConfetti(false);
    setTimeout(() => {
      setCards(prevCards => prevCards.map(card => ({ ...card, isFlipped: false })));
    }, 2000);
  };

  const flipCard = (id) => {
    const newCards = [...cards];
    const card = newCards[id];
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    Animated.timing(card.animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    card.isFlipped = true;
    setFlippedCards([...flippedCards, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = flippedCards;

      if (cards[firstCard].symbol === cards[secondCard].symbol) {
        setMatches(matches + 1);
        setCards(prevCards => prevCards.map(card =>
          card.id === firstCard || card.id === secondCard
            ? { ...card, isMatched: true }
            : card
        ));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card =>
            flippedCards.includes(card.id)
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards]);

  useEffect(() => {
    if (matches === symbols.length) {
      setShowConfetti(true);
    }
  }, [matches]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Memory Game</Text>
          <Text style={styles.stats}>Moves: {moves} | Matches: {matches}/{symbols.length}</Text>
          <View style={styles.grid}>
            {cards.map((card) => (
              <TouchableOpacity key={card.id} onPress={() => flipCard(card.id)}>
                <Animated.View style={[styles.card, card.isFlipped || card.isMatched ? styles.cardFlipped : styles.cardBack]}>
                  <Text style={styles.cardText}>{card.isFlipped || card.isMatched ? card.symbol : '?'}</Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={initializeGame} style={styles.resetButton}>
            <Text style={styles.resetText}>Restart Game</Text>
          </TouchableOpacity>
          {showConfetti && <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} />}
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  stats: {
    fontSize: 18,
    color: '#000',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: cardSize,
    height: cardSize,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#bbb',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6, 
  },
  cardBack: {
    backgroundColor: '#dde1e7',
  },
  cardFlipped: {
    backgroundColor: '#fff',
    borderColor: '#333',
    borderWidth: 2,
  },
  cardText: {
    fontSize: 30,
    color: '#333',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  resetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MemoryGame;