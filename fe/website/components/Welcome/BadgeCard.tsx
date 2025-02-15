import React, { Component } from 'react';
import { log } from 'console';
import { IconHeart } from '@tabler/icons-react';
import { Badge, Button, Card, Group, Image, SimpleGrid, Text } from '@mantine/core';
import Recipe from './Recipe';

// import { ActionIcon, Badge, Button, Card, Group, Image, Text } from '@mantine/core';

const cardData = [
  {
    id: 1,
    title: 'Black Bean Brownies',
    image: '/images/download.jpg',
    estTime: 'Est time: 1 hour',
    badge: 'Dessert',
  },
  {
    id: 2,
    title: 'Sausage and Egg Rice Bowl',
    image: '/images/download (2).jpg',
    estTime: 'Est time: 45 minutes',
    badge: 'Main',
  },
  {
    id: 3,
    title: 'Vegan Bibimbap',
    image: '/images/download (3).jpg',
    estTime: 'Est time: 1 hour',
    badge: 'Vegan',
  },
  {
    id: 4,
    title: 'Dumpling Xiao Long Bao',
    image: '/images/download (4).jpg',
    estTime: 'Est time: 45 minutes',
    badge: 'Dessert',
  },
  {
    id: 5,
    title: 'Grilled Salmon Salad',
    image: '/images/download (5).jpg',
    estTime: 'Est time: 2 hour',
    badge: 'Main',
  },
  {
    id: 6,
    title: 'Penguin Sea Rice',
    image: '/images/download (6).jpg',
    estTime: 'Est time: 30 minutes',
    badge: 'Main',
  },
];

class BadgeCard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      menuView: 'Menu',
      selectedRecipe: null,
    };
  }

  // renderView = () => {
  //   switch (this.state.selectedRecipe) {
  //     // case '':
  //     //   return this.renderCard();
  //     case 'Black Bean Brownies':
  //       return <Recipe onBack={this.goBack} />;
  //     default:
  //       return this.renderCard();
  //   }
  // };

  renderView = () => {
    if (this.state.selectedRecipe) {
      return <Recipe title={this.state.selectedRecipe} onBack={this.goBack} />;
    }
    return this.renderCard();
  };

  goBack = () => {
    this.setState({ menuView: 'Menu', selectedRecipe: '' });
  };

  renderCard = () => {
    return (
      <>
        <SimpleGrid cols={3} spacing={'lg'}>
          {cardData.map((card) => (
            <Card
              key={card.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              onClick={() => {
                this.setState({ selectedRecipe: card.title });
                console.log(card);
              }}
            >
              <Card.Section component="a">
                <Image src={card.image} height={160} alt={card.title} />
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{card.title}</Text>
                <Badge color="pink">{card.badge}</Badge>
              </Group>

              <Text size="sm" c="dimmed">
                {card.estTime}
              </Text>

              {/* <Button color="blue" fullWidth mt="md" radius="md">
                Book classic tour now
              </Button> */}
            </Card>
          ))}
        </SimpleGrid>
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
        {this.renderView()}
        {/* {this.renderNavbar()} */}
      </>
    );
  }
}

export default BadgeCard;
