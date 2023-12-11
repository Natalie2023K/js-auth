// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

// Підключіть файли роутів
const { User } = require('../class/user')
User.create({
    email: 'test@email.com',
    password: 123,
    role: 1,
})
// Підключіть інші файли роутів, якщо є

router.get('/signup', function(req, res) {
    return res.render('signup', {
        name: 'signup',
        component: ['back-button', 'field', 'field-password', 'field-checkbox', 'field-select',],
        title: 'Signup Page',
        data: {
            role: [
               { value: User.USER_ROLE.USER, text: 'Користувач'},
               {
                value: User.USER_ROLE.ADMIN,
                text: 'Адміністратор'
               },
               {
                value: User.USER_ROLE.DEVELOPER,
                text: 'Розробник',
               } 
            ]
        }
    })
})
router.post('/signup', function(req, res) {
    const {email, password, role} = req.body
    console.log(req.body)
    if(!email || !password || !role) {
        return res.status(400).json({
            message: "Помилка обов'язкові поля відсутні",
        })
    }
    try {
        User.create({email, password, role})
        return res.status(200).json({
            message: 'Користувач успішно зареєстрований',
        })
    } catch (err) {
        return res.status(400).json({
            message: "Помилка створення користувача",
        })
    }
   
})
// Об'єднайте файли роутів за потреби

// Використовуйте інші файли роутів, якщо є

// Експортуємо глобальний роутер
module.exports = router
