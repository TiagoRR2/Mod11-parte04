export default (req, res, next) => {
  if (!req.authenticationInfo) {
    return res.status(400).json({message: "Usuário não está logado"})
  }
  next()
}