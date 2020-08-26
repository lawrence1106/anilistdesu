import React from "react";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { Typography, Divider, withStyles, Button } from "@material-ui/core";
import { Settings } from "@material-ui/icons";
import MUIDatatables from "mui-datatables";
import "../Fonts/Bangers-Regular.ttf";
import Axios from "axios";
import droppedListLogo from "../Images/droppedListLogo.png";

const getListUrl = "http://localhost:3001/getList";

const styles = {
  listHeader: {
    display: "flex",
    alignItems: "center",
  },
  font: {
    fontFamily: "Bangers",
  },
  appbarIcons: {
    height: "10vh",
    margin: "5px",
  },
};
const options = {
  filterType: "checkbox",
  selectableRowsHideCheckboxes: true,
  selectableRowsHeader: false,
  print: false,
  download: false,
  viewColumns: false,
};

class DroppedAnime extends React.Component {
  state = {
    droppedList: [],
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
      listType: "droppedList",
    }).then((res) => {
      this.setState({ droppedList: res.data });
    });
  }

  render() {
    const { classes } = this.props;

    const actions = (event) => {
      let aniId = event.currentTarget.value;
    };

    const columns = [
      {
        key: "pending",
        name: "ani_name",
        label: "Anime",
        options: {
          filter: false,
          customHeadLabelRender: () => {
            return (
              <Typography variant="h5" className={classes.font}>
                Anime
              </Typography>
            );
          },
        },
      },
      {
        name: "ani_status",
        label: "Progress",
        options: {
          customHeadLabelRender: () => {
            return (
              <Typography variant="h5" className={classes.font}>
                Status
              </Typography>
            );
          },
        },
      },
      {
        name: "ani_id",
        label: "Actions",
        options: {
          customBodyRender: (value) => {
            console.log();
            return (
              <Button
                value={value}
                variant="contained"
                color="primary"
                onClick={actions}
              >
                <Settings />
              </Button>
            );
          },
          customHeadLabelRender: () => {
            return (
              <Typography variant="h5" className={classes.font}>
                Actions
              </Typography>
            );
          },
          filter: false,
        },
      },
    ];
    return (
      <div>
        <MUIDatatables
          title={[
            <div key="MUIDatatables">
              <div className={classes.listHeader}>
                <img
                  src={droppedListLogo}
                  alt="List Icon"
                  className={classes.appbarIcons}
                />
                <Typography className={classes.font} variant="h3">
                  Dropped Anime
                </Typography>
              </div>
              <Divider />
            </div>,
          ]}
          options={options}
          columns={columns}
          data={this.state.droppedList}
        />
      </div>
    );
  }
}

export default withStyles(styles)(withCookies(DroppedAnime));
