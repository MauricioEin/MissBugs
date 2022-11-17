

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  downloadPDF,
  getByUser
}

const BASE_URL = `/api/bug/`


function query(filterBy) {
  return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}


function getById(bugId) {
  return axios.get(BASE_URL + bugId).then(res => res.data)
}

function getByUser(userId) {
  console.log('entered1')
  return axios.get(BASE_URL + 'user/' + userId).then(res => res.data)

}


function getEmptyBug() {
  return {
    title: '',
    severity: '',
    description: '',
  }
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId).then(res => res.data)
}


function save(bug) {
  if (bug._id)
    return axios.put(BASE_URL + bug._id, bug).then((res) => res.data)
  return axios.post(BASE_URL, bug).then((res) => res.data)
}

function downloadPDF() {
  console.log('entered app service')
  return axios.get(BASE_URL + 'pdf').then(res => {
    console.log('res:', res)
    return res.data
  })
}