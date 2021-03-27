import React, { Component } from 'react'
import axios from 'axios'
import StudentProfile from './StudentProfile'
class MainMenu extends Component {
  state = {
    studentList: null,
    filteredSearchList: null,
    nameSearchInput: "",
    tagSearchInput: "",
  }
  componentDidMount = () => {
    axios.get('https://www.hatchways.io/api/assessment/students')
      .then(res => {
        res.data.students.forEach(student => {
          student.tags = []
        })
        this.setState(() => ({
          studentList: res.data.students,
          filteredStudentList: res.data.students
        }))
      })
  }

  handleNameSearchChange = (event) => {
    const searchTerm = event.target.value
    const updatedSearchResults = this.getUpdatedSearchResults(searchTerm.toLowerCase(), this.state.tagSearchInput)
    this.setState(() => ({
      nameSearchInput: searchTerm,
      filteredStudentList: updatedSearchResults
    }))
  }

  handleTagSearchChange = (event) => {
    const searchTerm = event.target.value
    const updatedSearchResults = this.getUpdatedSearchResults(this.state.nameSearchInput, searchTerm.toLowerCase())
    this.setState(() => ({
      tagSearchInput: searchTerm,
      filteredStudentList: updatedSearchResults
    }))
  }

  getUpdatedSearchResults = (nameSearch, tagSearch) => {
    const { studentList } = this.state
    let updatedStudentList = studentList.filter(({ firstName, lastName }) => (
      firstName.toLowerCase().includes(nameSearch) || lastName.toLowerCase().includes(nameSearch)
    ))
    updatedStudentList = updatedStudentList.filter(({ tags }) => (
      tagSearch.length > 0 ? tags.some(tag => tag.toLowerCase().includes(tagSearch)) : true
    ))
    return updatedStudentList
  }

  onTagSubmit = (id, tags) => {
    let studentListCopy = this.state.studentList
    studentListCopy.forEach(student => {
      if (student.id === id) {
        student['tags'] = tags
      }
    })
    this.setState(() => ({
      studentList: studentListCopy
    }))
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    const { filteredStudentList } = this.state
    return (
      <div className="main-menu-container">
        {filteredStudentList &&
          <div className="student-list-container">
            <form onSubmit={this.handleSubmit}>
              <input type="text" className="name-input" value={this.state.nameSearchInput} placeholder="Search by name" onChange={this.handleNameSearchChange} />
            </form>
            <form onSubmit={this.handleSubmit}>
              <input type="text" className="tag-input" value={this.state.tagSearchInput} placeholder="Search by tags" onChange={this.handleTagSearchChange} />
            </form>
            {filteredStudentList.length > 0
              ? filteredStudentList.map(student => {
                return (
                  <StudentProfile key={student.id} student={student} onTagSubmit={this.onTagSubmit} />
                )
              })
              : <div className="empty-student-list">
                <p>No results found. Try searching something else!</p>
              </div>}
          </div>}
      </div>
    )
  }
}

export default MainMenu
