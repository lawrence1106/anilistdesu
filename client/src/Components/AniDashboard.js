import React from "react";
import Axios from "axios";
import { Cookies, withCookies } from "react-cookie";
import { instanceOf } from "prop-types";
import { Helmet } from "react-helmet";
import { Card, CardContent, Typography, withStyles } from "@material-ui/core";
import "../Fonts/Bangers-Regular.ttf";

const getListUrl = "http://localhost:3001/getList";
const styles = (theme) => ({
  font: {
    fontFamily: "Bangers",
  },
});
class aniDashboard extends React.Component {
  state = {
    favorites: [],
  };
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      sessionName: cookies.get(["sessionName"]),
    };
  }

  componentDidMount() {
    Axios.post(getListUrl, {
      sessionName: this.state.sessionName,
      listType: "Favorites",
    }).then((res) => {
      this.setState({ favorites: res.data });
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Helmet>
          <title>Anilist Desu! - Ani - Dashboard</title>
        </Helmet>
        <Card>
          <CardContent>
            <Typography variant="h2" className={classes.font}>
              Coming Soon!
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}
export default withStyles(styles)(withCookies(aniDashboard));
