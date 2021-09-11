exports.uploadError = (err) => {
    let errors = { format: '', maxSize: '' }

    if(err.message.includes('invalide file'))
        errors.format = "Incompatible format";

    if(err.message.includes('max size'))
        errors.maxSize = "the file exceeds 50ko";

    return errors;
}