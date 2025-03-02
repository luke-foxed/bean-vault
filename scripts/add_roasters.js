/* eslint-disable no-undef */
import { initializeApp } from 'firebase/app'
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore'
import 'dotenv/config'

const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
}

const roasters = [
  {
    name: '3FE',
    location: 'Ireland',
    logo: 'https://w7.pngwing.com/pngs/335/825/png-transparent-coffee-roasting-cafe-3fe-food-fulham-f-c-food-text-cafe.png',
    website: 'https://3fe.com/',
  },
  {
    name: 'Carrow',
    location: 'Ireland',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYzKAHho-ahGm2imNJ64EDdaxHD2Dym-YINw&s',
    website: 'https://carrow.ie/',
  },
  {
    name: 'Mancoco',
    location: 'UK',
    logo: 'https://mancoco.co.uk/cdn/shop/files/mancoco_black_600x.png?v=1613783898',
    website: 'https://mancoco.co.uk',
  },
]

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function addRoasterDocuments() {
  for (const roaster of roasters) {
    const roasterDocRef = doc(collection(db, 'roasters'))
    await setDoc(roasterDocRef, roaster)
    console.log(`Added roaster: ${roaster.name}`)
  }

  console.log('All roasters added successfully!')
}

addRoasterDocuments().catch((error) => console.error('Error adding roasters:', error))
