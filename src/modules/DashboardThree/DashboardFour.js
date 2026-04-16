import React from "react";
import { MainContainer, ContentWrapper } from "./StyledComponents";
import { Grid } from "@mui/material";

import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { TicketCard } from "./TicketCard";
import TicketsByPriority from "./DashBoardComponents/TicketsByPriority";
import TicketTrends from "./DashBoardComponents/TicketTrends";
import AgentPerformance from "./DashBoardComponents/AgentPerformance";
import CustomerSatisfaction from "./DashBoardComponents/CustomerSatisfaction";
import ResolutionTime from "./DashBoardComponents/ResolutionTime";

const MainDashboard = () => {
  const ticketData = [
    {
      title: "Total Orders",
      count: "12,345",
      percentage: "+5.2% from last month",
      icon: <ConfirmationNumberOutlinedIcon />,
      color: "#8884d8",
      to: "/total-tickets",
    },
    {
      title: "Open Orders",
      count: "3,456",
      percentage: "+12% from last month",
      icon: <ConfirmationNumberOutlinedIcon />,
      color: "#82ca9d",
      to: "/open-tickets",
    },
    {
      title: "Closed Orders",
      count: "8,234",
      percentage: "+3% from last month",
      icon: <ConfirmationNumberOutlinedIcon />,
      color: "#ffc658",
      to: "/closed-tickets",
    },
    {
      title: "Pending Orders",
      count: "655",
      percentage: "-2% from last month",
      icon: <ConfirmationNumberOutlinedIcon />,
      color: "#d884d8",
      to: "/pending-tickets",
    },
  ];

  return (
    <MainContainer>
      <ContentWrapper>
        <Grid container spacing={3}>
          {ticketData.map((ticket, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <TicketCard
                title={ticket.title}
                count={ticket.count}
                percentage={ticket.percentage}
                icon={ticket.icon}
                color={ticket.color}
                to={ticket.to}
              />
            </Grid>
          ))}
          <Grid item xs={12} md={4}>
            <TicketsByPriority />
          </Grid>
          <Grid item xs={12} md={4}>
            <TicketTrends />
          </Grid>
          <Grid item xs={12} md={4}>
            <AgentPerformance />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomerSatisfaction />
          </Grid>
          <Grid item xs={12} md={6}>
            <ResolutionTime />
          </Grid>
        </Grid>
      </ContentWrapper>
    </MainContainer>
  );
};

export default MainDashboard;
