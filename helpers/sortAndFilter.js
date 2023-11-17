// const  Op = require('sequelize');

// exports.sortingAndFiltering = (req, res, next) => {
//     const { sort = 'likes', order = 'DESC', categories, dateFrom, dateTo, status } = req.query;

//     let orderBy;
//     if (sort === 'date') {
//         orderBy = [['createdAt', order]];
//     } else if (sort === 'likes') {
//         orderBy = [['like', order]];
//     } else {
//         orderBy = [['like', 'DESC']]; 
//     }

//     let where = {};
//     if (categories) {
//         where.categoryName = categories;
//     }
//     if (dateFrom && dateTo) {
//         where.createdAt = {
//             [Op.between]: [dateFrom, dateTo],
//         };
//     }
//     if (status) {
//         where.status = status;
//     }

//     req.postSortingAndFiltering = {
//         order: orderBy,
//         where: where,
//     };

//     next();
// };
