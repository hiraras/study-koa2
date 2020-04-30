
const { exec } = require('../db/mysql');
const xss = require('xss');

const getList = async (author, keyword) => {
  // 1=1 适配后续内容
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += `order by createtime desc;`;
  return await exec(sql);
}

const getDetail = async (id) => {
  const sql = `select * from blogs where id=${id}`;
  return await exec(sql);
}

const newBlog = async (data = {}) => {
  const title = xss(data.title);
  const content = xss(data.content);
  let sql = `
    insert into blogs (title, content, createtime, author)
    values ('${title}', '${content}', ${Date.now()}, '${data.author}');
  `;
  const insertData = await exec(sql);
  if (insertData.affectedRows > 0) {
    return { id: insertData.insertId };
  } else {
    throw new Error('fail to add new blog');
  }
}

const updateBlog = async (data) => {
  const title = xss(data.title);
  const content = xss(data.content);
  const id = data.id;
  const author = data.author;
  let sql = `
    update blogs set title='${title || ''}', content='${content || ''}' where id=${id || ''} and author = '${author || ''}';
  `;
  const updateData = await exec(sql);
  if (updateData.affectedRows > 0) {
    return { id };
  } else {
    throw new Error('fail to add update blog');
  }
}

const deleteBlog = async (id = '', author = '') => {
  let sql = `
    delete from blogs where id=${id} and author='${author}';
  `;
  const delData = await exec(sql);
  if (delData.affectedRows > 0) {
    return { id };
  } else {
    throw new Error('fail to delete the blog');
  }
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}
