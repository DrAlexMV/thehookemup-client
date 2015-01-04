/**
 * @jsx m
 */

var User = require('model/user');

var UserListBig = function (users) {
	var userList = {};

	userList.view = function () {
		return (
			<div className="ui relaxed divided items">{
				users.map(function(item) {
					return (
						<div className="item">
							<div className="ui tiny image">
								<img src={User.getPicture(item)} />
							</div>
							<div className="content">
								<a href={'/profile/' + item._id()} 
									config={m.route} className="header">
									{User.getName(item)}
								</a>
								<div className="meta">
									{item.role()}
								</div>
								<div className="description">
									{item.description()}
								</div>
							</div>
						</div>
					);
				})
			}</div>
		);
	};

	return userList;
};

module.exports = UserListBig;
