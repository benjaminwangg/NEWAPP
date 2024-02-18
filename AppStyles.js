import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerInputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 20, // Add some bottom margin for iOS picker
  },
  pickerInputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 20, // Add some bottom margin for Android picker
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100, // Make the image round
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#ddd', // Light gray border
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9', // Light green background for results, adjust as needed
    borderRadius: 10,
    width: '90%', // Adjust width as needed
  },
  resultText: {
    fontSize: 16,
    color: '#333', // Dark text color for readability
    textAlign: 'center', // Center the text
  },
});
