/* eslint-disable prettier/prettier */
import Vuex from 'vuex'
import auth from './modules/auth.js'
import users from './modules/users.js'
import providers from './modules/providers.js'
import role from './modules/role.js'
import permission from './modules/permission.js'
import destination from './modules/destination.js'
import location from './modules/location.js'
import category from './modules/category.js'
import bill from './modules/bill.js'
import customer from './modules/customer.js'
import service from './modules/service'
import billInfo from './modules/billInfo.js'
import payment from './modules/payment.js'

const store = () => {
	return new Vuex.Store({
		modules: {
			auth,
			users,
			role,
			permission,
            destination,
            providers,
			location,
			category,
			bill,
			customer,
			service,
			billInfo,
			payment,
		},
	})
}

export default store