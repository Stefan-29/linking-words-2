let currentSlide = 1;
        const totalSlides = 5;

        function showSlide(slideNumber) {
            // Hide all slides
            document.querySelectorAll('.slide').forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Show the current slide
            document.getElementById('slide' + slideNumber).classList.add('active');
            
            // Update progress dots
            document.querySelectorAll('.progress-dot').forEach((dot, index) => {
                if (index + 1 <= slideNumber) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // Update buttons
            document.getElementById('prevBtn').disabled = (slideNumber === 1);
            document.getElementById('nextBtn').disabled = (slideNumber === totalSlides);
        }

        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                showSlide(currentSlide);
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                showSlide(currentSlide);
            }
        });

        // Allow clicking on progress dots
        document.querySelectorAll('.progress-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                currentSlide = parseInt(dot.getAttribute('data-slide'));
                showSlide(currentSlide);
            });
        });

        // Check story answers
        document.getElementById('check-story').addEventListener('click', function() {
            const selects = document.querySelectorAll('.linking-select');
            let correct = 0;
            
            selects.forEach(select => {
                if (select.value === select.getAttribute('data-correct')) {
                    select.style.backgroundColor = "#d4edda";
                    correct++;
                } else {
                    select.style.backgroundColor = "#f8d7da";
                }
            });
            
            const feedback = document.getElementById('story-feedback');
            if (correct === selects.length) {
                feedback.textContent = "Great job! Your story is perfect!";
                feedback.style.color = "green";
            } else {
                feedback.textContent = `You got ${correct} out of ${selects.length} correct. Try again!`;
                feedback.style.color = "red";
            }
        });

        // Check category answers
        document.getElementById('check-categories').addEventListener('click', function() {
            const selects = document.querySelectorAll('.category-select');
            let correct = 0;
            
            selects.forEach(select => {
                if (select.value === select.getAttribute('data-correct')) {
                    select.style.backgroundColor = "#d4edda";
                    correct++;
                } else {
                    select.style.backgroundColor = "#f8d7da";
                }
            });
            
            const feedback = document.getElementById('category-feedback');
            if (correct === selects.length) {
                feedback.textContent = "Excellent! You know your linking word categories!";
                feedback.style.color = "green";
            } else {
                feedback.textContent = `You got ${correct} out of ${selects.length} correct. Keep practicing!`;
                feedback.style.color = "red";
            }
        });

        // Sortable items functionality
        document.querySelectorAll('.sortable-item').forEach(item => {
            item.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.textContent);
                this.style.opacity = '0.4';
            });
            
            item.addEventListener('dragend', function() {
                this.style.opacity = '1';
            });
            
            // Make items draggable
            item.setAttribute('draggable', 'true');
        });
        
        // Drop zone functionality
        const dropContainer = document.querySelector('.drag-container');
        
        dropContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#e0f7fa';
        });
        
        dropContainer.addEventListener('dragleave', function() {
            this.style.backgroundColor = '';
        });
        
        dropContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            
            const text = e.dataTransfer.getData('text/plain');
            const item = document.createElement('p');
            item.textContent = text;
            item.style.padding = '5px';
            item.style.margin = '5px 0';
            item.style.backgroundColor = '#fffacd';
            item.style.borderRadius = '5px';
            
            this.appendChild(item);
        });

        document.addEventListener('DOMContentLoaded', function() {
          if (document.getElementById('slide2')) {
              initMemoryGame();
          }
      });
      
      function initMemoryGame() {
          const gameBoard = document.querySelector('.game-board');
          if (!gameBoard) return;
          
          const cards = [
              { word: 'and', type: 'addition' },
              { word: 'also', type: 'addition' },
              { word: 'but', type: 'contrast' },
              { word: 'however', type: 'contrast' },
              { word: 'because', type: 'reason' },
              { word: 'so', type: 'reason' },
              { word: 'first', type: 'sequence' },
              { word: 'finally', type: 'sequence' }
          ];
          
          // Create pairs (word + type)
          const cardPairs = [];
          cards.forEach(card => {
              cardPairs.push({
                  content: card.word,
                  type: card.type,
                  id: `word-${card.word}`
              });
              cardPairs.push({
                  content: getTypeTitle(card.type),
                  type: card.type,
                  id: `type-${card.type}-${card.word}`
              });
          });
          
          // Shuffle the cards
          const shuffledCards = shuffleArray([...cardPairs]);
          
          // Clear existing content and create the cards
          gameBoard.innerHTML = '';
          shuffledCards.forEach(card => {
              const cardElement = document.createElement('div');
              cardElement.className = 'memory-card';
              cardElement.dataset.id = card.id;
              cardElement.dataset.type = card.type;
              
              const frontFace = document.createElement('div');
              frontFace.className = `card-front ${card.type}`;
              frontFace.textContent = card.content;
              
              const backFace = document.createElement('div');
              backFace.className = 'card-back';
              
              cardElement.appendChild(frontFace);
              cardElement.appendChild(backFace);
              gameBoard.appendChild(cardElement);
          });
          
          // Game state
          let hasFlippedCard = false;
          let lockBoard = false;
          let firstCard, secondCard;
          let matches = 0;
          let attempts = 0;
          
          // Update counters
          function updateCounters() {
              document.getElementById('match-count').textContent = matches;
              document.getElementById('attempt-count').textContent = attempts;
          }
          
          // Check for a match
          function checkForMatch() {
              const isMatch = firstCard.dataset.type === secondCard.dataset.type &&
                             firstCard.dataset.id !== secondCard.dataset.id;
              
              if (isMatch) {
                  disableCards();
                  matches++;
              } else {
                  unflipCards();
              }
              
              attempts++;
              updateCounters();
              
              // Check if game is complete
              if (matches === cards.length) {
                  setTimeout(() => {
                      alert('Congratulations! You found all the matches!');
                  }, 500);
              }
          }
          
          // Disable matched cards
          function disableCards() {
              firstCard.classList.add('matched');
              secondCard.classList.add('matched');
              
              firstCard.removeEventListener('click', flipCard);
              secondCard.removeEventListener('click', flipCard);
              
              resetBoard();
          }
          
          // Unflip non-matching cards
          function unflipCards() {
              lockBoard = true;
              
              setTimeout(() => {
                  firstCard.classList.remove('flipped');
                  secondCard.classList.remove('flipped');
                  
                  resetBoard();
              }, 1500);
          }
          
          // Reset the board for the next selection
          function resetBoard() {
              [hasFlippedCard, lockBoard] = [false, false];
              [firstCard, secondCard] = [null, null];
          }
          
          // Flip card function
          function flipCard() {
              if (lockBoard) return;
              if (this === firstCard) return;
              
              this.classList.add('flipped');
              
              if (!hasFlippedCard) {
                  // First click
                  hasFlippedCard = true;
                  firstCard = this;
                  return;
              }
              
              // Second click
              secondCard = this;
              checkForMatch();
          }
          
          // Add click event to all cards
          document.querySelectorAll('.memory-card').forEach(card => {
              card.addEventListener('click', flipCard);
          });
          
          // Reset game button
          document.getElementById('reset-game').addEventListener('click', function() {
              resetGame();
          });
          
          // Reset the entire game
          function resetGame() {
              matches = 0;
              attempts = 0;
              updateCounters();
              
              // Reset and reshuffle cards
              const newShuffledCards = shuffleArray([...cardPairs]);
              const allCards = document.querySelectorAll('.memory-card');
              
              allCards.forEach((card, index) => {
                  card.classList.remove('flipped', 'matched');
                  
                  setTimeout(() => {
                      card.dataset.id = newShuffledCards[index].id;
                      card.dataset.type = newShuffledCards[index].type;
                      
                      const frontFace = card.querySelector('.card-front');
                      frontFace.className = `card-front ${newShuffledCards[index].type}`;
                      frontFace.textContent = newShuffledCards[index].content;
                      
                      card.addEventListener('click', flipCard);
                  }, 500);
              });
              
              resetBoard();
          }
          
          // Helper functions
          function getTypeTitle(type) {
              switch(type) {
                  case 'addition': return 'Addition';
                  case 'contrast': return 'Contrast';
                  case 'reason': return 'Reason';
                  case 'sequence': return 'Sequence';
                  default: return type;
              }
          }
          
          function shuffleArray(array) {
              for (let i = array.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [array[i], array[j]] = [array[j], array[i]];
              }
              return array;
          }
      }

        // Initialize
        showSlide(currentSlide);