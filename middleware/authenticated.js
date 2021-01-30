export default ({ store, redirect }) => {
  if (!store.getters.currentUser) {
    return redirect('/admin/login')
  }
}
