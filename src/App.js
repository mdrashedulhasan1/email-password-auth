import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import app from './firebase.init';
function App() {
  const [registered, setRegistered] = useState(false);
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const auth = getAuth(app);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleEmailBlur = (event) => {
    const email = event.target.value;
    setEmail(email);
    console.log(email);
  }
  const handlePasswordBlur = (event) => {
    const password = event.target.value;
    setPassword(password);
    console.log(password);
  }
  const handleNameBlur = (event) =>{
    setName(event.target.value);

  }
  const handleFormSubmit = (event) => {
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          setUser(user)
          console.log(user)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          const errorMessage = error.message;
          setErrorMessage(errorMessage)
        });
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user);
          setUser(user)
          setEmail('')
          setPassword('')
          veryfyEmail();
          setUserName();
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          const errorMessage = error.message;
          setErrorMessage(errorMessage)
        });
    }
    event.preventDefault();
  };
  const handleRegisteredChanged = event => {
    setRegistered(event.target.checked);
  };
  const veryfyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        // Email verification sent!
        // ...
        console.log('Email Verification sent');
      });
  };
  const handlePasswordReset = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        console.log("Email Sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  const setUserName = ()=>{
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => {
      // Profile updated!
      console.log('updated name');
    }).catch((error) => {
      // An error occurred
      
    });
  }
  return (
    <div className="App">
      <div className='w-50 mx-auto mt-5'>
        <h1 className='text-primary'>{registered ? 'Login' : 'Please Register'}</h1>
        <Form onSubmit={handleFormSubmit}>
          { !registered &&
            <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>User Name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter name" required />
          </Form.Group>
          }
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChanged} type="checkbox" label="Already Registered?" />
          </Form.Group>
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
          <Button onClick={handlePasswordReset} variant="link">Forget Password?</Button>
        </Form>
        <p className='text-danger'>{errorMessage}</p>
      </div>
    </div>
  );
}

export default App;
