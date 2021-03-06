import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import ActivityCard from './ActivityCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'
import { timeToString, getDailyReminderMessage } from '../utils/helpers'
import TextButton from './TextButton'

class EntryDetail extends Component {
	static navigationOptions = ({ navigation }) => {
		const { entryId } = navigation.state.params

		const year = entryId.slice(0, 4)
		const month = entryId.slice(5, 7)
		const day = entryId.slice(8)
		return {
			title: `${day}/${month}/${year}`,
		}
	}

	reset = () => {
		const { remove, goBack, entryId } = this.props

		remove()
		goBack()
		removeEntry(entryId)
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.metrics !== null && !nextProps.activities.today
	}

	render() {
		const { activities } = this.props
		return (
			<View style={styles.container}>
				<ActivityCard activities={activities} />
				<TextButton onPress={this.reset} style={{ margin: 20 }}>
					Reset
				</TextButton>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: white,
		padding: 15,
	},
})

const mapStateToProps = (state, { navigation }) => {
	const { entryId } = navigation.state.params

	return {
		entryId,
		activities: state[entryId],
	}
}

const mapDispatchToProps = (dispatch, { navigation }) => {
	const { entryId } = navigation.state.params
	return {
		remove: () =>
			dispatch(
				addEntry({
					[entryId]:
						timeToString() === entryId ? getDailyReminderMessage() : null,
				}),
			),
		goBack: () => navigation.goBack(),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)
