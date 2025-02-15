import React, { Component } from 'react';
import {
  IconArrowBack,
  IconArrowLeft,
  IconArrowRight,
  IconClock,
  IconHeart,
  IconTimeDuration0,
} from '@tabler/icons-react';
import { Badge, Button, Card, Group, Image, Select, SimpleGrid, Text, Title } from '@mantine/core';
import Instruction from './Instruction';

// import { ActionIcon, Badge, Button, Card, Group, Image, Text } from '@mantine/core';

// const cardData = [
//   {
//     id: 1,
//     title: 'Black Bean Brownies',
//     image: '/images/download.jpg',
//     estTime: '1 hour',
//     badge: 'Dessert',
//     link: 'https://mantine.dev/',
//   },
//   {
//     id: 2,
//     title: 'Sausage and Egg Rice Bowl',
//     image: '/images/download (2).jpg',
//     estTime: '45 minutes',
//     badge: 'Main',
//     link: 'https://mantine.dev/',
//   },
//   {
//     id: 3,
//     title: 'Vegan Bibimbap',
//     image: '/images/download (3).jpg',
//     estTime: '1 hour',
//     badge: 'Vegan',
//     link: 'https://mantine.dev/',
//   },
//   {
//     id: 4,
//     title: 'Dumpling Xiao Long Bao',
//     image: '/images/download (4).jpg',
//     estTime: '45 minutes',
//     badge: 'Dessert',
//     link: 'https://mantine.dev/',
//   },
//   {
//     id: 5,
//     title: 'Grilled Salmon Salad',
//     image: '/images/download (5).jpg',
//     estTime: '2 hour',
//     badge: 'Main',
//     link: 'https://mantine.dev/',
//   },
//   {
//     id: 6,
//     title: 'Penguin Sea Rice',
//     image: '/images/download (6).jpg',
//     estTime: '30 minutes',
//     badge: 'Main',
//     link: 'https://mantine.dev/',
//   },
// ];

class Recipe extends Component<any, any> {
  state = { instruction: false };

  goBack = () => {
    this.setState({ instruction: false });
  };

  goNext = () => {
    this.setState({
      // menuView: 'Instruction',
      // selectedRecipe: 'Black Bean Brownies',
      instruction: true,
    });
  };

  renderPage = () => {
    switch (this.state.instruction) {
      case false:
        return (
          <>
            {this.renderMenuBar()}
            {this.renderMenuContent()}
          </>
        );
      case true:
        return <Instruction onBack={this.goBack} />;
      default:
        return (
          <>
            {this.renderMenuBar()}
            {this.renderMenuContent()}
          </>
        );
    }
  };
  renderMenuBar = () => {
    return (
      <>
        {/* <div
          style={{
            color: '#FFFDF4',
          }}
        > */}
        <div
          style={{
            display: 'flex',
            height: '100vh',
            width: '450px',
            flexDirection: 'column',
            columnGap: '30',
            backgroundColor: '#FFFDF4',
            gap: '50px',
          }}
        >
          <Title ta={'center'}>Black Bean Brownies</Title>
          <Image src="/images/download.jpg" height={'300px'} />
          <Group justify="center" align="center">
            <IconClock />
            <Text>Estimated time: 45 minutes</Text>
          </Group>
          <Button
            color="#FFF4AB"
            radius={10}
            h={60}
            w={300}
            justify="center"
            style={{ alignSelf: 'center' }}
          >
            <Text fw={'bold'} color="black">
              Start Cooking
            </Text>
          </Button>
        </div>
        {/* </div> */}
      </>
    );
    <></>;
  };
  renderMenuContent = () => {
    return (
      <>
        <Group display={'flex'} style={{ flexDirection: 'column' }}>
          <Group>
            <Title>Ingredients</Title>
            <Select
              display={'flex'}
              // label="Your favorite library"
              placeholder="For 2 servings"
              data={['For 1 servings', 'For 2 servings', 'For 4 servings', 'For 8 servings']}
              searchable
            />
          </Group>
          <Group>
            <IconArrowLeft
              size={'3rem'}
              onClick={this.props.onBack}
              style={{ cursor: 'pointer', backgroundColor: '#dfdfdf', borderRadius: '45px' }}
            />{' '}
            <IconArrowRight
              size={'3rem'}
              onClick={this.goNext}
              style={{ cursor: 'pointer', backgroundColor: '#dfdfdf', borderRadius: '45px' }}
            />{' '}
          </Group>
        </Group>
      </>
    );
  };

  render() {
    return (
      <>
        <div style={{ display: 'flex' }}>{this.renderPage()}</div>
      </>
    );
  }
}

export default Recipe;
