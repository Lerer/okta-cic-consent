import express, { Express, Request, Response } from 'express';
import session from 'express-session';

import dotenv from 'dotenv';
import path from "path";


dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "i-love-auth0",
  resave: false,
  saveUninitialized: true
}));
const port = process.env.PORT || 3000

app.set("views", path.join(__dirname,'..', "views"));
app.set("view engine","pug");
app.use(express.static(path.join(__dirname,'..', "public")));

app.get('/', (req: Request, res: Response) => {
    const {auth0_domain,state} = req.query;
    if (auth0_domain) {
        req.session.domain = auth0_domain as string;
    }
    if (state) {
        req.session.state = state as string;
    }
    //console.dir(req);
    console.log( req.originalUrl);
    console.log(req.body);
    console.log(req.method,req.query);
    res.render('consent-form',{});
});

app.use('/consent', (req: Request, res: Response) => {
  res.render('consent-form',{});
});

app.post('/form-submit', (req,res)=> {
    console.dir(req.session);
    console.log(req.body);
    const returnUrl = `https://${req.session.domain}/continue?state=${req.session.state}`;
    let str = [];
    str.push(`<form id="theForm" action="${returnUrl}" method="POST">`)
    str.push(`<input type="hidden" name="confirm" value="${req.body.consent==='1'?'yes':'no'}">`)
    str.push(`</form>`)
    str.push(`<script>`)
    str.push(`document.getElementById("theForm").submit()`)
    str.push(`</script>`)
    return res.send(str.join(''))
    //res.redirect(returnUrl);
})


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

