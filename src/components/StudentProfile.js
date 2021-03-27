import React, { Component } from 'react'
import { generateUID } from '../utils/helpers'

const PLUS = "+"
const MINUS = "-"

class StudentProfile extends Component {
  state = {
    expandedViewToggle: false,
    toggleIcon: PLUS,
    tagInput: ""
  }
  getAverageTestScore = (testScores) => {
    let sum = 0
    for (let i = 0; i < testScores.length; i++) {
      sum += parseInt(testScores[i])
    }
    return (sum / testScores.length).toFixed(2)
  }

  handleExpandClick = () => {
    this.setState(() => ({
      toggleIcon: this.state.toggleIcon === PLUS ? MINUS : PLUS,
      expandedViewToggle: !this.state.expandedViewToggle
    }))
  }

  handleTagChange = (event) => {
    const tagInput = event.target.value
    this.setState(() => ({
      tagInput
    }))
  }

  handleTagSubmit = (event) => {
    event.preventDefault()

    let tagsCopy = this.props.student.tags
    tagsCopy.push(this.state.tagInput)
    const { id } = this.props.student

    this.props.onTagSubmit(id, tagsCopy)
    this.setState(() => ({
      tagInput: "",
    }))

  }

  render() {
    const { id, pic, firstName, lastName, email, company, skill, grades, tags } = this.props.student
    const { toggleIcon, expandedViewToggle } = this.state
    return (
      <div className="student-container" key={id}>
        <div className="student-details-container">
          <div>
            <img src={pic} alt="Student avatar" className="student-avatar" />
          </div>
          <div className="student-details-general">
            <p className="student-name">{`${firstName} ${lastName}`}</p>
            <div className="student-details-inner">
              <p>Email: {email}</p>
              <p>Company: {company}</p>
              <p>Skill: {skill}</p>
              <p>Average: {this.getAverageTestScore(grades)}%</p>
              {expandedViewToggle &&
                <div>
                  {grades.map((grade, index) => {
                    return (
                      <p key={index} className="test-scores">{`Test ${index + 1}: ${grade}%`}</p>
                    )
                  })}
                  <div className="tags-section">
                    {tags.map(tag => {
                      return (
                        <div key={generateUID()} className="tag">
                          <p>{tag}</p>
                        </div>
                      )
                    })}
                  </div>
                  <form onSubmit={this.handleTagSubmit}>
                    <input type="text" className="add-tag-input" value={this.state.tagInput} onChange={this.handleTagChange} placeholder="Add a tag" />
                  </form>
                </div>
              }
            </div>
          </div>
          <div className="expand-btn-container">
            <button className="expand-btn" type="button">
              <h2 className="expand-btn-toggle" onClick={this.handleExpandClick}>{toggleIcon}</h2>
            </button>
          </div>
        </div>

      </div>
    )
  }
}

export default StudentProfile
