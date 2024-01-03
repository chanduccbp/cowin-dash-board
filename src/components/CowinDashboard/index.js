import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

class CowinDashboard extends Component {
  state = {data1: [], data2: [], data3: [], isLoading: true, showError: false}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)

    if (response.ok) {
      const vData = await response.json()
      const updatedData1 = vData.last_7_days_vaccination.map(eachObj => ({
        vaccineDate: eachObj.vaccine_date,
        dose1: eachObj.dose_1,
        dose2: eachObj.dose_2,
      }))
      const updatedData2 = vData.vaccination_by_age
      const updatedData3 = vData.vaccination_by_gender

      this.setState({
        isLoading: false,
        data1: updatedData1,
        data2: updatedData2,
        data3: updatedData3,
      })
    } else {
      this.setState({isLoading: false, showError: true})
    }
  }

  renderFailureView = () => (
    <div className="fv-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="fv-pic"
      />
      <h1>Something Went Wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-cont">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderCharts = () => {
    const {data1, data2, data3} = this.state

    return (
      <div className="charts">
        <VaccinationCoverage data={data1} />
        <VaccinationByGender data={data3} />
        <VaccinationByAge data={data2} />
      </div>
    )
  }

  render() {
    const {showError, isLoading} = this.state
    const renderVaccinationDetails = showError
      ? this.renderFailureView()
      : this.renderCharts()
    return (
      <div className="bg-cont">
        <div className="wl-cont">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="wl"
          />
          <h2 className="wl-head">Co-WIN</h2>
        </div>
        <h1 className="w-head">CoWIN Vaccination in India</h1>
        {isLoading ? this.renderLoader() : renderVaccinationDetails}
      </div>
    )
  }
}

export default CowinDashboard
