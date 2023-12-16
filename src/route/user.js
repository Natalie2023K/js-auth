// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

// Підключіть файли роутів

const { User } = require('../class/user')

// Підключіть інші файли роутів, якщо є

router.get('/user-list', function (req, res) {
    // res.render генерує нам HTML сторінку
  
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('user-list', {
      // вказуємо назву контейнера
      name: 'user-list',
      // вказуємо назву компонентів
      component: [
        'back-button',
       
      ],
  
      // вказуємо назву сторінки
      title: 'User List page',
      // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout
  
      // вказуємо дані,
      data: {
       
      },
    })
    // ↑↑ сюди вводимо JSON дані
  })


  router.get('/user-item', function (req, res) {
    // res.render генерує нам HTML сторінку
  
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('user-item', {
      // вказуємо назву контейнера
      name: 'user-item',
      // вказуємо назву компонентів
      component: [
        'back-button',
       
      ],
  
      // вказуємо назву сторінки
      title: 'User Item page',
      // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout
  
      // вказуємо дані,
      data: {
       
      },
    })
    // ↑↑ сюди вводимо JSON дані
  })
  router.get('/user-item-data', function(req, res) {
    const {id} =req.query
    if(!id) {
        return res.status(400).json({
            message:'Потрібно передати ID користувача'
        })
    }
    const user = User.getById(Number(id))
    if(!user) {
        return res.status(400).json({
            message: 'Користувач з таким ID не існує'
        })
    }
    return res.status(200).json({
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            isConfirm: user.isConfirm,
        }
    })
  })


  
  router.get('/user-list-data', function (req, res) {
    const list = User.getList()


    if(list.length === 0) {
        return res.status(400).json({
            message: 'Список користувачів пустий'
        })
    }
    return res.status(200).json({
        list: list.map(({id, email, role}) => ({
            id,
            email,
            role,
        }))
    })
  })
 
// Об'єднайте файли роутів за потреби

// Використовуйте інші файли роутів, якщо є

// Експортуємо глобальний роутер
module.exports = router
