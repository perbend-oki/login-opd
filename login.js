import { getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js'
import firebase from './login.firebase.js';
const { bcrypt } = dcodeIO;
const { db } = firebase;

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const yearInput = document.getElementById('year');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const year = yearInput.value;
    
    // fetch user data from firestore
    const userRef = await getDoc(doc(db, 'users', username));
    if (!userRef.exists()) {
      throw Error('Data user tidak ditemukan!');
    }
    const userData = userRef.data();
    
    // validate password
    try {
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        throw Error();
      }
    } catch (error) {
      throw Error('Password tidak cocok!');
    }

    // decrypt url
    const encryptedUrl = userData[year];
    if (!encryptedUrl) {
      throw Error('Tahun anggaran tidak tersedia!');
    }
    const url = CryptoJS.AES.decrypt(encryptedUrl, password).toString(CryptoJS.enc.Utf8);

    // redirect
    if (url === '') {
      window.location.href = url;
    } else {
      throw Error('Tahun anggaran tidak tersedia!');
    }
  } catch (error) {
    alert('Gagal Masuk: ' +error.message);
  }
});
