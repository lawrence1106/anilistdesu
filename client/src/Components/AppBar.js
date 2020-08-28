import React, { useState } from "react";
import { withRouter, useHistory, Route } from "react-router-dom";
import Axios from "axios";
import { AppBar, makeStyles, Typography } from "@material-ui/core";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "../Fonts/Bangers-Regular.ttf";

import add from "../Images/add.png";
import options from "../Images/options.png";
import closeLogo from "../Images/close.png";
import logoutLogo from "../Images/logout.png";
import profileLogo from "../Images/profile.png";
import byebyeLogo from "../Images/byebye.png";
import droppedList from "../Images/droppedList.png";
import yourListLogo from "../Images/yourListLogo.png";
import dashboardLogo from "../Images/dashboard.png";

import AniList from "./AniList";
import DroppedAnime from "./DroppedAnime";

const MySwal = withReactContent(Swal);

const getCredentialsUrl = "http://localhost:3001/getCredentials";

const useStyles = makeStyles({
  appBar: {
    height: "10vh",
  },
  font: {
    fontFamily: "Bangers",
  },
  appbarIcons: {
    height: "11vh",
    margin: "5px",
    cursor: "pointer",
  },
  chottoMatte: {
    height: "50px",
    margin: "5px",
    cursor: "pointer",
  },
  greeter: {
    display: "flex",
    alignItems: "center",
  },
  appbarContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  optionsContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: "35vh",
  },
  closeButton: {
    height: "5px",
  },
  options: {
    cursor: "pointer",
  },
  optionIcons: {
    height: "20vh",
  },
  container: {
    marginTop: "10vh",
    padding: "1.66%",
  },
  actionsContainer: {
    marginTop: "7.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  itemsHolder: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSize: {
    height: "20vh",
    cursor: "pointer",
  },
});

function Homepage() {
  const history = useHistory();
  const classes = useStyles();
  const [cookies, setCookies, removeCookie] = useCookies(["sessionName"]);
  const [fullName, setFullName] = useState("");

  const getCredentials = async () => {
    await Axios.post(getCredentialsUrl, {
      sessionName: cookies["sessionName"],
    }).then((res) => {
      setFullName(res.data.fullName);
    });
  };
  getCredentials();

  const swalTemplate = (content) => {
    MySwal.fire({
      html: <div>{content}</div>,
      showCloseButton: true,
      showConfirmButton: false,
      width: "40rem",
      closeButtonHtml:
        "<img alt='close logo' src=" + closeLogo + " style='height: 35px;' />",
    });
  };

  const navigation = () => {
    const content = () => {
      return (
        <div className={classes.actionsContainer}>
          <div className={classes.itemsHolder}>
            <Typography variant="h4" className={classes.font}>
              Your List
            </Typography>
            <img
              className={classes.logoSize}
              src={yourListLogo}
              alt="Your List Logo"
              onClick={() => {
                history.push({ pathname: "/yourList" });
                Swal.close();
              }}
            />
          </div>

          <div className={classes.itemsHolder}>
            <Typography variant="h4" className={classes.font}>
              Dashboard
            </Typography>
            <img
              className={classes.logoSize}
              src={dashboardLogo}
              alt="Your List Logo"
              onClick={() => {
                history.push({ pathname: "/" });
                Swal.close();
              }}
            />
          </div>

          <div className={classes.itemsHolder}>
            <Typography variant="h4" className={classes.font}>
              Dropped
            </Typography>
            <img
              className={classes.logoSize}
              src={droppedList}
              alt="Dropped Logo"
              onClick={() => {
                history.push({ pathname: "/droppedAnime" });
                Swal.close();
              }}
            />
          </div>
        </div>
      );
    };
    swalTemplate(content());
  };

  const endSession = () => {
    MySwal.fire({
      confirmButtonText: "Mata ne!",
      html: (
        <div>
          <Typography variant="h5" className={classes.font}>
            Byebye!
          </Typography>
          <img
            className={classes.optionIcons}
            src={byebyeLogo}
            alt="Byebye Logo"
          />
        </div>
      ),
      onClose: () => {
        removeCookie(["sessionName"]);
        history.push("/");
      },
    });
  };
  const userOptions = () => {
    MySwal.fire({
      html: (
        <div className={classes.optionsContainer}>
          <div className={classes.options}>
            <Typography variant="h5" className={classes.font}>
              Profile
            </Typography>
            <img
              className={classes.optionIcons}
              src={profileLogo}
              alt="Profile Logo"
            />
          </div>
          <div className={classes.options}>
            <Typography variant="h5" className={classes.font}>
              Logout
            </Typography>
            <img
              className={classes.optionIcons}
              src={logoutLogo}
              alt="Logout Logo"
              onClick={endSession}
            />
          </div>
        </div>
      ),
      showCloseButton: true,
      showConfirmButton: false,
      closeButtonHtml: "<img src=" + closeLogo + " style='height: 35px;' />",
    });
  };

  return (
    <div>
      <AppBar className={classes.appBar}>
        <div className={classes.appbarContent}>
          <div className={classes.greeter}>
            <img
              onClick={() => {
                navigation();
              }}
              alt="Greeter Icon"
              className={classes.appbarIcons}
              src={add}
            />
            <Typography className={classes.font} variant="h4">
              Okairi: {fullName}
            </Typography>
          </div>
          <div className={classes.right}>
            <img
              src={options}
              className={classes.appbarIcons}
              alt="chotto matte!"
              onClick={userOptions}
            />
          </div>
        </div>
      </AppBar>
      <div className={classes.container}>
        <div>
          <Route path="/yourList">
            <title>Anilist Desu! - Your List</title>
            <AniList />
          </Route>
          <Route path="/droppedAnime">
            <DroppedAnime />
          </Route>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Homepage);
