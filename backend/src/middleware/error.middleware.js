async function handleError(err,req,res,next) {
    
    const code = err.status
    console.log(err)
   

    res.status(code).json({
        message:err?.message || err?.errors,
        error:true,
        details:err?.stack || 'NA'
    })
    
}

export default handleError