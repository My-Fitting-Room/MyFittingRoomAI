import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';

// HTML content for the form wizard
const generateWizardHTML = (initialData = {}) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Information Wizard</title>
    <style>
        * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        body {
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
            overflow-x: hidden;
        }
        
        .wizard-container {
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .step {
            display: none;
            animation: fadeIn 0.5s;
        }
        
        .step.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        h2 {
            font-size: 22px;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 16px;
        }
        
        input, select, textarea {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            background-color: white;
            transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        input:focus, select:focus, textarea:focus {
            border-color: #6c5ce7;
            box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
            outline: none;
        }
        
        .radio-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .radio-option {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .radio-option input {
            width: auto;
        }
        
        .button-group {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
        }
        
        button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
        }
        
        button:active {
            transform: scale(0.98);
        }
        
        .btn-next {
            background-color: #6c5ce7;
            color: white;
        }
        
        .btn-prev {
            background-color: #e9ecef;
            color: #495057;
        }
        
        .btn-submit {
            background-color: #00b894;
            color: white;
        }
        
        .progress-container {
            margin-bottom: 30px;
        }
        
        .progress-bar {
            height: 4px;
            background-color: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background-color: #6c5ce7;
            transition: width 0.3s ease;
        }
        
        .step-indicator {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            color: #adb5bd;
            font-size: 14px;
        }
        
        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .checkbox-option {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .checkbox-option input {
            width: auto;
        }
        
        .error-text {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="wizard-container">
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
            <div class="step-indicator">
                <span>Start</span>
                <span>Finish</span>
            </div>
        </div>
        
        <!-- Step 1: Personal Information -->
        <div class="step active" id="step1">
            <h2>Personal Information</h2>
            
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" required>
                <div class="error-text" id="fullName-error"></div>
            </div>
            
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter your email address" required>
                <div class="error-text" id="email-error"></div>
            </div>
            
            <div class="form-group">
                <label for="age">Age</label>
                <input type="number" id="age" name="age" min="18" max="120" placeholder="Enter your age" required>
                <div class="error-text" id="age-error"></div>
            </div>
            
            <div class="button-group">
                <div></div> <!-- Empty div for spacing -->
                <button type="button" class="btn-next" onclick="nextStep(1, 2)">Next</button>
            </div>
        </div>
        
        <!-- Step 2: Preferences -->
        <div class="step" id="step2">
            <h2>Your Preferences</h2>
            
            <div class="form-group">
                <label>What is your favorite season?</label>
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" id="season-spring" name="season" value="Spring">
                        <label for="season-spring">Spring</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="season-summer" name="season" value="Summer">
                        <label for="season-summer">Summer</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="season-fall" name="season" value="Fall">
                        <label for="season-fall">Fall</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="season-winter" name="season" value="Winter">
                        <label for="season-winter">Winter</label>
                    </div>
                </div>
                <div class="error-text" id="season-error"></div>
            </div>
            
            <div class="form-group">
                <label for="color">Favorite Color</label>
                <select id="color" name="color" required>
                    <option value="">Select a color</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="yellow">Yellow</option>
                    <option value="orange">Orange</option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                </select>
                <div class="error-text" id="color-error"></div>
            </div>
            
            <div class="button-group">
                <button type="button" class="btn-prev" onclick="prevStep(2, 1)">Previous</button>
                <button type="button" class="btn-next" onclick="nextStep(2, 3)">Next</button>
            </div>
        </div>
        
        <!-- Step 3: Interests -->
        <div class="step" id="step3">
            <h2>Your Interests</h2>
            
            <div class="form-group">
                <label>Select your hobbies (select at least one):</label>
                <div class="checkbox-group">
                    <div class="checkbox-option">
                        <input type="checkbox" id="hobby-reading" name="hobbies" value="Reading">
                        <label for="hobby-reading">Reading</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" id="hobby-sports" name="hobbies" value="Sports">
                        <label for="hobby-sports">Sports</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" id="hobby-cooking" name="hobbies" value="Cooking">
                        <label for="hobby-cooking">Cooking</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" id="hobby-travel" name="hobbies" value="Travel">
                        <label for="hobby-travel">Travel</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" id="hobby-music" name="hobbies" value="Music">
                        <label for="hobby-music">Music</label>
                    </div>
                    <div class="checkbox-option">
                        <input type="checkbox" id="hobby-gaming" name="hobbies" value="Gaming">
                        <label for="hobby-gaming">Gaming</label>
                    </div>
                </div>
                <div class="error-text" id="hobbies-error"></div>
            </div>
            
            <div class="form-group">
                <label for="dream-destination">Dream Travel Destination</label>
                <input type="text" id="dream-destination" name="dreamDestination" placeholder="Where would you love to visit?">
            </div>
            
            <div class="button-group">
                <button type="button" class="btn-prev" onclick="prevStep(3, 2)">Previous</button>
                <button type="button" class="btn-next" onclick="nextStep(3, 4)">Next</button>
            </div>
        </div>
        
        <!-- Step 4: Completion -->
        <div class="step" id="step4">
            <h2>Almost Done!</h2>
            
            <div class="form-group">
                <label for="feedback">Any additional comments?</label>
                <textarea id="feedback" name="feedback" rows="4" placeholder="Share your thoughts..."></textarea>
            </div>
            
            <div class="form-group">
                <div class="checkbox-option">
                    <input type="checkbox" id="terms" name="terms" required>
                    <label for="terms">I agree to the terms and conditions</label>
                </div>
                <div class="error-text" id="terms-error"></div>
            </div>
            
            <div class="button-group">
                <button type="button" class="btn-prev" onclick="prevStep(4, 3)">Previous</button>
                <button type="button" class="btn-submit" onclick="submitForm()">Submit</button>
            </div>
        </div>
    </div>

    <script>
        // Initialize with any pre-filled data
        const initialData = ${JSON.stringify(initialData)};
        
        // Fill form with initial data if available
        document.addEventListener('DOMContentLoaded', function() {
            if (initialData.fullName) document.getElementById('fullName').value = initialData.fullName;
            if (initialData.email) document.getElementById('email').value = initialData.email;
            if (initialData.age) document.getElementById('age').value = initialData.age;
            if (initialData.season) {
                const seasonRadio = document.querySelector(\`input[name="season"][value="\${initialData.season}"]\`);
                if (seasonRadio) seasonRadio.checked = true;
            }
            if (initialData.color) document.getElementById('color').value = initialData.color;
            if (initialData.hobbies && Array.isArray(initialData.hobbies)) {
                initialData.hobbies.forEach(hobby => {
                    const hobbyCheckbox = document.querySelector(\`input[name="hobbies"][value="\${hobby}"]\`);
                    if (hobbyCheckbox) hobbyCheckbox.checked = true;
                });
            }
            if (initialData.dreamDestination) document.getElementById('dream-destination').value = initialData.dreamDestination;
            if (initialData.feedback) document.getElementById('feedback').value = initialData.feedback;
            if (initialData.terms) document.getElementById('terms').checked = initialData.terms;
        });

        // Step navigation functions
        let currentStep = 1;
        const totalSteps = 4;
        
        function updateProgressBar() {
            const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
            document.getElementById('progress-fill').style.width = \`\${progress}%\`;
        }
        
        function nextStep(current, next) {
            // Validate current step
            if (!validateStep(current)) return;
            
            // Hide current step, show next step
            document.getElementById(\`step\${current}\`).classList.remove('active');
            document.getElementById(\`step\${next}\`).classList.add('active');
            
            currentStep = next;
            updateProgressBar();
        }
        
        function prevStep(current, prev) {
            document.getElementById(\`step\${current}\`).classList.remove('active');
            document.getElementById(\`step\${prev}\`).classList.add('active');
            
            currentStep = prev;
            updateProgressBar();
        }
        
        function validateStep(step) {
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.error-text').forEach(el => {
                el.textContent = '';
            });
            
            // Step 1 validation
            if (step === 1) {
                const fullName = document.getElementById('fullName').value.trim();
                const email = document.getElementById('email').value.trim();
                const age = document.getElementById('age').value;
                
                if (!fullName) {
                    document.getElementById('fullName-error').textContent = 'Please enter your full name';
                    isValid = false;
                }
                
                if (!email) {
                    document.getElementById('email-error').textContent = 'Please enter your email address';
                    isValid = false;
                } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
                    document.getElementById('email-error').textContent = 'Please enter a valid email address';
                    isValid = false;
                }
                
                if (!age) {
                    document.getElementById('age-error').textContent = 'Please enter your age';
                    isValid = false;
                } else if (parseInt(age) < 18 || parseInt(age) > 120) {
                    document.getElementById('age-error').textContent = 'Age must be between 18 and 120';
                    isValid = false;
                }
            }
            
            // Step 2 validation
            else if (step === 2) {
                const season = document.querySelector('input[name="season"]:checked');
                const color = document.getElementById('color').value;
                
                if (!season) {
                    document.getElementById('season-error').textContent = 'Please select your favorite season';
                    isValid = false;
                }
                
                if (!color) {
                    document.getElementById('color-error').textContent = 'Please select your favorite color';
                    isValid = false;
                }
            }
            
            // Step 3 validation
            else if (step === 3) {
                const hobbies = document.querySelectorAll('input[name="hobbies"]:checked');
                
                if (hobbies.length === 0) {
                    document.getElementById('hobbies-error').textContent = 'Please select at least one hobby';
                    isValid = false;
                }
            }
            
            return isValid;
        }
        
        function submitForm() {
            // Final validation
            if (!validateStep(4)) return;
            
            // Check terms agreement
            const termsChecked = document.getElementById('terms').checked;
            if (!termsChecked) {
                document.getElementById('terms-error').textContent = 'You must agree to the terms and conditions';
                return;
            }
            
            // Collect all form data
            const formData = {
                fullName: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                age: parseInt(document.getElementById('age').value),
                season: document.querySelector('input[name="season"]:checked')?.value,
                color: document.getElementById('color').value,
                hobbies: Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(cb => cb.value),
                dreamDestination: document.getElementById('dream-destination').value.trim(),
                feedback: document.getElementById('feedback').value.trim(),
                terms: termsChecked
            };
            
            // Send data back to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'formSubmit',
                data: formData
            }));
        }
        
        // Initialize progress bar
        updateProgressBar();
    </script>
</body>
</html>
`;

const TestScreen = () => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const webViewRef = useRef(null);

  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      if (message.type === 'formSubmit') {
        setFormData(message.data);
        setSubmitted(true);
        // You could also navigate to another screen or send data to an API here
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({});
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {submitted ? (
        // Success screen after form submission
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Form Submitted!</Text>
          <Text style={styles.successSubtitle}>Here's what you shared with us:</Text>
          
          <View style={styles.dataContainer}>
            <Text style={styles.dataLabel}>Name:</Text>
            <Text style={styles.dataValue}>{formData.fullName}</Text>
            
            <Text style={styles.dataLabel}>Email:</Text>
            <Text style={styles.dataValue}>{formData.email}</Text>
            
            <Text style={styles.dataLabel}>Age:</Text>
            <Text style={styles.dataValue}>{formData.age}</Text>
            
            <Text style={styles.dataLabel}>Favorite Season:</Text>
            <Text style={styles.dataValue}>{formData.season}</Text>
            
            <Text style={styles.dataLabel}>Favorite Color:</Text>
            <Text style={styles.dataValue}>{formData.color}</Text>
            
            <Text style={styles.dataLabel}>Hobbies:</Text>
            <Text style={styles.dataValue}>{formData.hobbies?.join(', ')}</Text>
            
            <Text style={styles.dataLabel}>Dream Destination:</Text>
            <Text style={styles.dataValue}>{formData.dreamDestination || 'Not specified'}</Text>
            
            <Text style={styles.dataLabel}>Feedback:</Text>
            <Text style={styles.dataValue}>{formData.feedback || 'No feedback provided'}</Text>
          </View>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
            <Text style={styles.resetButtonText}>Complete Another Form</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Form WebView
        <View style={styles.webViewContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6c5ce7" />
              <Text style={styles.loadingText}>Loading form...</Text>
            </View>
          )}
          
          <WebView
            ref={webViewRef}
            source={{ html: generateWizardHTML(formData) }}
            onMessage={handleMessage}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            style={styles.webView}
            // Hide scroll indicator bars
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            // Remove bouncing effect
            bounces={false}
            // Make it look like a native component
            containerStyle={styles.webViewInner}
            // Additional styling
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  webViewInner: {
    borderRadius: 0,
    overflow: 'hidden',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  successContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  dataContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dataLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6c5ce7',
    marginTop: 12,
  },
  dataValue: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  resetButton: {
    marginTop: 30,
    backgroundColor: '#6c5ce7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TestScreen;