import {USER_LOGIN_FAILED, USER_LOGIN_SUCCESS, USER_LOGOUT} from '../actions/users'

export default function (state = {}, action = {}) {
	switch (action.type) {
		case USER_LOGIN_FAILED:
			return {
				error: action.payload
			}
			case USER_LOGIN_SUCCESS:
			return {}

			case USER_LOGOUT:
			return {}

		default:
      return state
	}
}
