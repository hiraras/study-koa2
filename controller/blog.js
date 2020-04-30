
const { exec } = require('../db/mysql');
const xss = require('xss');

const getList = (author, keyword) => {
  // 1=1 适配后续内容
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += `order by createtime desc;`;
  return exec(sql);
}

const getDetail = (id) => {
  const sql = `select * from blogs where id=${id}`;
  return exec(sql);
}

const newBlog = (data = {}) => {
  const title = xss(data.title);
  const content = xss(data.content);
  let sql = `
    insert into blogs (title, content, createtime, author)
    values ('${title}', '${content}', ${Date.now()}, '${data.author}');
  `;
  return exec(sql).then(insertData => {
    if (updateResult.affectedRows > 0) {
      return Promise.resolve({ id: insertData.insertId });
    } else {
      return Promise.reject('fail to add new blog');
    }
  }).catch(err => {
    return Promise.reject(err);
  });
}

const updateBlog = (data) => {
  const title = xss(data.title);
  const content = xss(data.content);
  const id = data.id;
  const author = data.author;
  let sql = `
    update blogs set title='${title || ''}', content='${content || ''}' where id=${id || ''} and author = '${author || ''}';
  `;
  return exec(sql).then(updateResult => {
    if (updateResult.affectedRows > 0) {
      return Promise.resolve({ id });
    } else {
      return Promise.reject('fail to update blog');
    }
  }).catch(err => {
    return Promise.reject(err);
  });
}

const deleteBlog = (id = '', author = '') => {
  let sql = `
    delete from blogs where id=${id} and author='${author}';
  `;
  return exec(sql).then(delResult => {
    if (delResult.affectedRows > 0) {
      return Promise.resolve({ id });
    } else {
      return Promise.reject('fail to delete the blog');
    }
  }).catch(err => {
    return Promise.reject(err);
  });
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}
