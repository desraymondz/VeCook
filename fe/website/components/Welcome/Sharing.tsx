import React, { Component } from 'react';
import { log } from 'console';
import { IconHeart } from '@tabler/icons-react';
import { Badge, Button, Card, Group, Image, SimpleGrid, Text } from '@mantine/core';
import Recipe from './Recipe';

class Sharing extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      menuView: 'Menu',
      selectedRecipe: null,
    };
  }

  //   renderView = () => {
  //     if (this.state.selectedRecipe) {
  //       return <Recipe title={this.state.selectedRecipe} onBack={this.goBack} />;
  //     }
  //     return this.renderCard();
  //   };

  //   goBack = () => {
  //     this.setState({ menuView: 'Menu', selectedRecipe: '' });
  //   };

  renderCard = () => {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image src="images/image 8.png" />
        </div>
      </>
    );
  };

  // renderNavbar = () => {
  //   return (
  //     <>
  //       <Button>
  //         <IconHeart />
  //       </Button>
  //     </>
  //   );
  // };

  render() {
    return (
      <>
        {this.renderCard()}
        {/* {this.renderNavbar()} */}
      </>
    );
  }
}

export default Sharing;
