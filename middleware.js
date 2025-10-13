

    module.exports.isLoggedIn=(req,res,res)=>{
         if(!req.isAuthenticated()){ //khudi auto pr check krly ga authenticate
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }

    }