import firebase from '@firebase/app';
import '@firebase/firestore'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const pathToArray = (path) => {
  const pathArray = path.split(".")
  let collections = [];
  let docs = [];
  pathArray.forEach((elem, i) => {
    if ((i + 1) % 2 === 0) {
      docs.push(elem)
    } else {
      collections.push(elem)
    }
  })
  return collections.map((value, index) => {
    return [value, docs[index]]
  })
}

const deepRef = (obj, [[collection, doc], ...restPath]) => {
  let newObj = obj.collection(collection)
  if (doc) { newObj = newObj.doc(doc) }
  if (!restPath.length){
    return newObj;
  }
  return deepRef(newObj, restPath)
}

class Firebase {
  constructor() {
    const app = firebase.initializeApp(config);
    this.firestore = app.firestore();
  }

  listen(path, func) {
    const pathArray = pathToArray(path)
    const docRef = deepRef(this.firestore, pathArray)
    return docRef.onSnapshot(func)
  }

  async collectionAsObject(path, filters = null) {
    const pathArray = pathToArray(path)

    const docRef = deepRef(this.firestore, pathArray)
    const result = await docRef.get()

    return result.docs.reduce((acc, ref) => {
      const data = {[ref.id]: {...ref.data(), id: ref.id}}
      const resultAcc = {...acc, ...data}
      return resultAcc;
    }, {})
  }

  async collectionAsList(path, filters = null) {
    const pathArray = pathToArray(path)

    const docRef = deepRef(this.firestore, pathArray)
    const result = await docRef.get()

    return result.docs.map((ref) => {
      return {...ref.data(), id: ref.id}
    })
  }

  async exists(path) {
    try {
      const pathArray = pathToArray(path)
      const docRef = deepRef(this.firestore, pathArray)
      const result = await docRef.get()
      return result.exists;
    }
    catch(error) {
      console.log('ERROR GET', error)
    }
  }

  getRef(path) {
    try {
      const pathArray = pathToArray(path)
      const ref = deepRef(this.firestore, pathArray)
      return ref;
    }
    catch(error) {
      console.log('ERROR GET REF', error)
    }
  }

  async get(path) {
    try {
      const pathArray = pathToArray(path)
      const docRef = deepRef(this.firestore, pathArray)
      const result = await docRef.get()
      return result.data();
    }
    catch(error) {
      console.log('ERROR GET', error)
    }
  }

  async set(path, data, options = {merge: false}) {
    try {
      const pathArray = pathToArray(path)
      const docRef = deepRef(this.firestore, pathArray)
      const result = await docRef.set(data, options)
      return result;
    }
    catch(error) {
      console.log('ERROR SET', error)
    }
  }

  add(collection, data, options = {}) {
    return this.firestore.collection(collection).add(data)
  }
}
export default Firebase;
