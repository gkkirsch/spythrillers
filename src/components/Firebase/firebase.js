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

const deepRef = (obj, [[collection, doc], ...restPath]) => {
  let newObj = obj.collection(collection)
  if (doc) { newObj = newObj.doc(doc) }
  if (!restPath.length){
    return newObj;
  }
  return deepRef(newObj, restPath)
}

const createPath = (basePath, path) => {
  if (path && basePath) return `${basePath}.${path}`;
  if (basePath && !path) return basePath;
  return path;
}

class Firebase {
  constructor() {
    const app = firebase.initializeApp(config);
    this.firestore = app.firestore();
  }

  pathToArray(path) {
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

  listen(path, func) {
    const pathArray = this.pathToArray(path)
    const docRef = deepRef(this.firestore, pathArray)
    return docRef.onSnapshot(func)
  }

  async collectionAsObject(path, filters = null) {
    const pathArray = this.pathToArray(path)

    const docRef = deepRef(this.firestore, pathArray)
    const result = await docRef.get()

    return result.docs.reduce((acc, ref) => {
      const data = {[ref.id]: {...ref.data(), id: ref.id}}
      const resultAcc = {...acc, ...data}
      return resultAcc;
    }, {})
  }

  async collectionAsList(path, filters = null) {
    const pathArray = this.pathToArray(path)

    const docRef = deepRef(this.firestore, pathArray)
    const result = await docRef.get()

    return result.docs.map((ref) => {
      return {...ref.data(), id: ref.id}
    })
  }

  async exists(path) {
    try {
      const pathArray = this.pathToArray(path)
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
      const pathArray = this.pathToArray(path)
      const ref = deepRef(this.firestore, pathArray)
      return ref;
    }
    catch(error) {
      console.log('ERROR GET REF', error)
    }
  }

  async deleteCollection(path) {
    // Get a new write batch
    const batch = this.firestore.batch();

    const pathArray = this.pathToArray(path)
    const snapshot = await deepRef(this.firestore, pathArray).get()
    snapshot.docs.map((val) => {
        batch.delete(val.ref)
    })

    batch.commit()
  }

  async get(path) {
    try {
      const pathArray = this.pathToArray(path)
      const docRef = deepRef(this.firestore, pathArray)
      const result = await docRef.get()
      return result.data();
    }
    catch(error) {
      console.log('ERROR GET', error)
    }
  }

  async set(path, data = {}, options = {merge: true}) {
    try {
      const pathArray = this.pathToArray(path)
      const docRef = deepRef(this.firestore, pathArray)
      const result = await docRef.set(data, options)
      return result;
    }
    catch(error) {
      console.log('ERROR SET', error)
    }
  }

  async create(path, data = {}) {
    try {
      const pathArray = this.pathToArray(path)
      const docRef = deepRef(this.firestore, pathArray).doc()
      const result = await docRef.set({...data, id: docRef.id})
      return docRef.id;
    }
    catch(error) {
      console.log('ERROR SET', error)
    }
  }

  addToList(path, data, options = {}) {
    const pathArray = this.pathToArray(path)
    const docRef = deepRef(this.firestore, pathArray)
    return docRef.add(data)
  }

  add(collection, data, options = {}) {
    return this.firestore.collection(collection).add(data)
  }
}
export default Firebase;
