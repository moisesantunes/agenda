var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var bodyParser = require('body-parser')
const app = express()

var mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/agendadb', {useNewUrlParser: true});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

app.set('view engine', 'ejs');
 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

//schema do usuario
const UsuarioSchema = new mongoose.Schema({
	nome: String,
	sobrenome: String,
	email: {type:String , unique:true},
	senha: String
})
const Usuario = mongoose.model('Usuario', UsuarioSchema)


app.get('/', function (req, res) {
if(req.session.usuario){
 console.log('ola: '+req.session.usuario.nome)
}
let usuario= req.session.usuario;
  res.render('index', 
  	{
  		id:req.sessionID,
  		usuario:usuario
  		
  	})
});

app.get('/login',(req, res) =>{
	res.render('login',
	{
		id:req.sessionID,
		usuario:req.session.usuario
	})
	
})
app.get('/cadastrar', (req,res)=>{
	res.render('cadastro',
		{
			id:req.sessionID,
			usuario:req.session.usuario
			
		})
	
})


app.post('/login', function (req, res) {
console.log(req.body);
req.session.usuario=req.body;
res.redirect('/')
})

app.post('/cadastro', (req, res)=>{
	Usuario.findOne({email: req.body.email}, function (err, usuario){
		if(err){console.log('deu ruim'+err)}
		console.log(usuario)
		if(!usuario){ 
			Usuario.create({
				nome:req.body.nome,
				sobrenome:req.body.sobrenome,
				email:req.body.email,
				senha: req.body.senha
			},function(err,us){
				if(err){console.log("nao cadastrou "+err)}
				res.json(us)		
			})
		}else{
			console.log('ja tem email')
			res.redirect(302, '/cadastrar')
		}		
	})

})

app.get('/todos',(req, res)=>{
	Usuario.find({},(erro, resultado)=>{
		if(erro)console.log(erro);
		res.json(resultado)
	})
})

app.get('/sair',(req, res)=>{
	req.session.destroy(function(err) {
	if(err){
		return err;
	}else{
		res.redirect('/')
	}
  // cannot access session here
	})
	
})



app.listen(3000, ()=>{
	console.log("ta rodando")
})