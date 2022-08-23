
import admin from 'firebase-admin'

import * as serviceAccount from '../../oyo-movers-test-firebase-adminsdk-tj3vb-6da00e6ac7.json'

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(<any>serviceAccount),
})

export default firebaseAdmin
