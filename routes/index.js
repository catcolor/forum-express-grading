const helpers = require('../_helpers')

const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')
const multer = require('multer')
const { authenticate } = require('passport')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  app.get('/', authenticated, (req, res) => {
    res.redirect('/restaurants')
  })
  app.get('/restaurants', authenticated, restController.getRestaurants)

  app.get('/admin', authenticated, (req, res) =>
    res.redirect('/admin/restaurants'))

  app.get('/admin/restaurants', authenticated, adminController.getRestaurants)

  //瀏覽使用者
  app.get('/admin/users', authenticated, adminController.getUsers)
  //修改使用者權限
  app.put('/admin/users/:id', authenticatedAdmin, adminController.toggleAdmin)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)

  // 修改後台新增餐廳的路由
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)

  // 修改後台編輯餐廳的路由
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  //瀏覽分類
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)

  //新增分類
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

  //編輯分類
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

  //刪除分類
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  //前台瀏覽餐廳個別資料
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  //新增評論
  app.post('/comments', authenticated, commentController.postComment)

  //刪除評論
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  //瀏覽Profile
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
}
