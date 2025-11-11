import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // En mode développement, utiliser une variable globale pour préserver la connexion
  // entre les rechargements HMR
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // En production, créer une nouvelle connexion
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

// Helper pour obtenir la DB directement
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db('inazuma_avatars')
}
