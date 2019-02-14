/* return 1 if x is Numeric OR return 0*/

exports.isNumeric = x => {
        return !isNaN(parseFloat(x)) && isFinite(x);
}