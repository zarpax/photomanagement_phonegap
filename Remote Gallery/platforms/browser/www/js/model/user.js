function User(userData) {
  this.userId = 0;
  this.name =  "";
  this.password = "";
  this.lastSync = "";

  if (userData) {
    if (userData.name) {
      this.name = userData.name;
    };

    if (userData.password) {
      this.password = userData.password;
    }

    if (userData.userId) {
      this.userId = userData.userId;
    }

    if (userData.lastSync) {
      this.lastSync = userData.lastSync;
    }
  }
}
