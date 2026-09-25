import {defineField, defineType} from 'sanity'

export default defineType({
	name: 'workout',
	title: 'Workout',
	type: 'document',
	fields: [
		defineField({
			name: 'userId',
			title: 'User ID',
			type: 'string',
			description: "The user's Clerk ID",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'date',
			title: 'Date',
			type: 'datetime',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'duration',
			title: 'Duration (seconds)',
			type: 'number',
			validation: (Rule) => Rule.required().integer().min(0),
		}),
		defineField({
			name: 'exercises',
			title: 'Exercises',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'workoutExercise',
					title: 'Exercise',
					fields: [
						defineField({
							name: 'exercise',
							title: 'Exercise',
							type: 'reference',
							to: [{type: 'exercise'}],
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'reps',
							title: 'Reps',
							type: 'number',
							validation: (Rule) => Rule.required().integer().min(0),
						}),
						defineField({
							name: 'weight',
							title: 'Weight',
							type: 'number',
							validation: (Rule) => Rule.required().min(0),
						}),
						defineField({
							name: 'weightUnit',
							title: 'Weight Unit',
							type: 'string',
							options: {
								list: [
									{title: 'Pounds (lbs)', value: 'lbs'},
									{title: 'Kilograms (kg)', value: 'kg'},
								],
								layout: 'radio',
							},
							validation: (Rule) => Rule.required(),
						}),
					],
					preview: {
						select: {
							exerciseTitle: 'exercise.title',
							reps: 'reps',
							weight: 'weight',
							weightUnit: 'weightUnit',
						},
						prepare({exerciseTitle, reps, weight, weightUnit}) {
							return {
								title: exerciseTitle || 'Exercise',
								subtitle: `${reps ?? 0} reps • ${weight ?? 0} ${weightUnit ?? ''}`,
							}
						},
					},
				},
			],
			validation: (Rule) => Rule.required().min(1),
		}),
	],
	preview: {
		select: {
			userId: 'userId',
			date: 'date',
			duration: 'duration',
		},
		prepare({userId, date, duration}) {
			return {
				title: date ? new Date(date).toLocaleDateString() : 'Workout',
				subtitle: `${duration ?? 0}s • ${userId ?? 'Unknown user'}`,
			}
		},
	},
})
