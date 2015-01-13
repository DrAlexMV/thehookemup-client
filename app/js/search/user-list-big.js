/**
 * @jsx m
 */

var User = require('model/user');

var UserListBig = function (users) {
	var userList = {};

	userList.view = function () {
		return (
			<div className="search-list">{
				users.map(function(item) {
					return (
						<div className="item">
							<div className="ui card">
								<div className="ui tiny image">
									<img src={User.getPicture(item)} />
								</div>
								<div className="content">
									<div className="name-header">
										<a href={'/profile/' + item._id()} 
											config={m.route} className="ui header">
											{User.getName(item)}
										</a>
										<div className="ui meta">
											{item.role()}
										</div>
									</div>
									<div className="description">
										{item.description()}
									</div>
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
