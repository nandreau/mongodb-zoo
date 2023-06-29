import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// User correspond a un modele mongoose 
import User from '../models/user'


const signup = (req, res, next) => {
    const {email, name, password} = req.body

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword,
            name: name
        })
        return  user.save();
    })
    .then(result => {
        res.status(201).json({ message: 'User created successfully', userId: result._id })
    })
    .catch(err => {
        // logique de gestion d'erreur 
        // usage de next pour traiter l'erreur avec un middleware
        next(err)
    })
}

const login = (req, res, next) => {
    const {email, password} = req.body
    let existingUser;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                // gerer l'erreur utilisateur non trouve, 
            }
            existingUser = user
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                // gerer l'erreur
                // usage de return , throw , next
            }
            // generation du JWT
            const token = jwt.sign(
                {
                    email: existingUser.email,
                    userId: existingUser._id.toString()
                },
                'un super secret qui provient du fichier .env',
                { expiresIn: '1h' }
            );

            res.status(200).json({ token: token, userId: existingUser._id.toString()})

        })
        .catch(err => {
            // gestion de l'erreur
            // passage au middleware de gestion d'erreur
            next(err)
        })

}