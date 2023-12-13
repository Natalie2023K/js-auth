// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

// Підключіть файли роутів

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
User.create({
    email: 'test@email.com',
    password: 123,
    role: 1,
})
// Підключіть інші файли роутів, якщо є

router.get('/signup', function (req, res) {
    // res.render генерує нам HTML сторінку
  
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('signup', {
      // вказуємо назву контейнера
      name: 'signup',
      // вказуємо назву компонентів
      component: [
        'back-button',
        'field',
        'field-password',
        'field-checkbox',
        'field-select',
      ],
  
      // вказуємо назву сторінки
      title: 'Signup page',
      // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout
  
      // вказуємо дані,
      data: {
        role: [
          { value: User.USER_ROLE.USER, text: 'Користувач' },
          {
            value: User.USER_ROLE.ADMIN,
            text: 'Адміністратор',
          },
          {
            value: User.USER_ROLE.DEVELOPER,
            text: 'Розробник',
          },
        ],
      },
    })
    // ↑↑ сюди вводимо JSON дані
  })
  
  router.post('/signup', function (req, res) {
    const { email, password, role } = req.body
  
    console.log(req.body)
  
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Помилка. Обов'язкові поля відсутні",
      })
    }
  
    try {
      const user = User.getByEmail(email)
  
      if (user) {
        return res.status(400).json({
          message: 'Помилка. Такий користувач вже існує',
        })
      }
  
      const newUser = User.create({ email, password, role })
  
      const session = Session.create(newUser)
  
      Confirm.create(newUser.email)
  
      return res.status(200).json({
        message: 'Користувач успішно зареєстрованний',
        session,
      })
    } catch (err) {
      return res.status(400).json({
        message: 'Помилка створення користувача',
      })
    }
  })
  router.get('/signup-confirm',function(req, res) {
    const {renew, email} = req.query
    if(renew) {
Confirm.create(email)
    }
    return res.render('signup-confirm', {
        name: 'signup-confirm',
        component: ['back-button', 'field'],
        title: 'Signup Confirm Page',
        data: {}
    })
  })

router.post('/signup-confirm', function(req, res) {
    const {token, code} = req.body
    if(!code || !token) {
        return res.status(400).json({
            message: "Помилка. Обов'язкові поля відсутні"
        })
    }
    try {
const session = Session.get(token)
if(!session) {
    return res.status(400).json({
        message: 'Ви не увійшли в аккаунт',
    })
}
const email = Confirm.getData(code)
if(!email) {
    return res.status(400).json({
        message: 'Код не існує'
    })
}
if(email !== session.user.email) {
    return res.status(400).json({
        message: 'Код не дійсний'
    })
}

// const user = User.getByEmail(session.user.email)
// user.isConfirm = true
session.user.isConfirm = true
return res.status(200).json({
    message: 'Ви підтвердили свою пошту',
    session,
})
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
    console.log(code, token)
})

router.get('/recovery', function (req, res) {
    return res.render('recovery', {
        name: 'recovery',
        component: ['back-button', 'field'],
        title: 'Recovery Page',
        data: {},
    })
})
router.post('/recovery', function(req, res) {
    const {email} = req.body
    console.log(email)
    if(!email) {
        return res.status(400).json({
            message: "Помилка. Обов'язкові поля відсутні"
        })
    }

   try {
    const user = User.getByEmail(email)
    if(!user) {
        return res.status(400).json({
            message: 'Користувача з такою поштою не існує',
        })
    }
     
   Confirm.create(email)
   return res.status(200).json({
    message: 'Код для відновлення паролю відправлено',
   })
   } catch (e) {
    return res.status(400).json({
        message: err.message,
    })
   }
})




router.get('/recovery-confirm', function(req, res) {
    return res.render('recovery-confirm', {
        name: 'recovery-confirm',
        component: ['back-button', 'field', 'field-password'],
        title: 'Recovery Confirm Page',
        data: {}
    })
})
router.post('/recovery-confirm', function(req, res) {
    const {password, code} = req.body
    console.log(password, code)
    if(!password || !code) {
        return res.status(400).json({
            message: "Помилка. Обов'язкові поля відсутні",
        })
    }
    try {
        const email = Confirm.getData(Number(code))
        if(!email) {
            return res.status(400).json({
                message: 'код не існує',
            })
        }
        const user = User.getByEmail(email)
        if(!user) {
            return res.status(400).json({
                message: 'Користувач з такою поштою не існує',
            })
        }
        user.password = password
        console.log(user)
        const session = Session.create(user)
        return res.status(200).json({
            message: 'Пароль змінено',
            session
        })
    }
    catch(e) {
        return res.status(400).json({
            message: err.message
        })
    }
})


router.get('/login', function(req, res) {
    return res.render('login', {
        name: 'login',
        component: ['back-button', 'field', 'field-password'],
        title: 'Login Page',
        data: {},
    })
})
router.post('/login', function(req, res) {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).json({
            message: "Помилка. Обов'язкові поля відсутні"
        })
    }
    
    try {
        const user = User.getByEmail(email)
        if(!user) {
            return res.status(400).json({
                message: 'Помилка. Користувача з такою поштою не існує'
            })
        }
        if(user.password !== password) {
            return res.status(400).json({
                message: 'Помилка. Пароль не підходить'
            })
        }
        const session = Session.create(user)
        return res.status(200).json({
            message:'Ви увійшли',
            session,
        })
    } catch(err) {
        return res.status(400).json({
            message: err.message
        })
    }
 
})



// Об'єднайте файли роутів за потреби

// Використовуйте інші файли роутів, якщо є

// Експортуємо глобальний роутер
module.exports = router
