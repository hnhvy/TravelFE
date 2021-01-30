export default ({ route, store, error }) => {
  // Get permissions from `.permissions` array defined in page components (parent + children)
  const permissions = [].concat(
    ...route.matched.map((r) => {
      return r.components.default.options
        ? r.components.default.options.permissions
        : r.components.default.permissions
    })
  )
  // Check if user has permission
  let userAuthorized = true
  if (
    !store.state.auth.currentUser.role.permissions.some(
      (item) => item.name === 'ALL'
    )
  ) {
    permissions.forEach((permission) => {
      if (
        userAuthorized &&
        !store.state.auth.currentUser.role.permissions.find(
          (p) => p.name === permission
        )
      ) {
        userAuthorized = false
      }
    })
  }
  // If user not authorized, show error page
  if (!userAuthorized) {
    return error({
      statusCode: 403,
    })
  }
}
