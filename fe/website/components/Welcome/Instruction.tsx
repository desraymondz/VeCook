import React, { Component } from 'react';
import { log } from 'console';
import {
  IconArrowLeft,
  IconArrowRight,
  IconClock,
  IconHeart,
  IconMicrophone,
} from '@tabler/icons-react';
import { Badge, Button, Card, Group, Image, SimpleGrid, Text, Title } from '@mantine/core';
import Recipe from './Recipe';
import Sharing from './Sharing';

// import { ActionIcon, Badge, Button, Card, Group, Image, Text } from '@mantine/core';

class Instruction extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { share: false };
  }

  goNext = () => {
    this.setState({
      // menuView: 'Instruction',
      // selectedRecipe: 'Black Bean Brownies',
      // instruction: false,
      share: true,
    });
  };

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

  //   renderView = () => {
  //     if (this.state.selectedRecipe) {
  //       return <Recipe title={this.state.selectedRecipe} onBack={this.goBack} />;
  //     }
  //     return this.renderCard();
  //   };

  //   goBack = () => {
  //     this.setState({ menuView: 'Menu', selectedRecipe: '' });
  //   };

  //   renderCard = () => {
  //     return (
  //       <>
  //         <SimpleGrid cols={3} spacing={'lg'}>
  //           {cardData.map((card) => (
  //             <Card
  //               key={card.id}
  //               shadow="sm"
  //               padding="lg"
  //               radius="md"
  //               withBorder
  //               onClick={() => {
  //                 this.setState({ selectedRecipe: card.title });
  //                 console.log(card);
  //               }}
  //             >
  //               <Card.Section component="a">
  //                 <Image src={card.image} height={160} alt={card.title} />
  //               </Card.Section>

  //               <Group justify="space-between" mt="md" mb="xs">
  //                 <Text fw={500}>{card.title}</Text>
  //                 <Badge color="pink">{card.badge}</Badge>
  //               </Group>

  //               <Text size="sm" c="dimmed">
  //                 {card.estTime}
  //               </Text>

  //               {/* <Button color="blue" fullWidth mt="md" radius="md">
  //                 Book classic tour now
  //               </Button> */}
  //             </Card>
  //           ))}
  //         </SimpleGrid>
  //       </>
  //     );
  //   };

  // renderNavbar = () => {
  //   return (
  //     <>
  //       <Button>
  //         <IconHeart />
  //       </Button>
  //     </>
  //   );
  // };

  renderPage = () => {
    switch (this.state.share) {
      case false:
        return (
          <>
            {this.renderInstructionBar()}
            {this.renderInstructionContent()}
          </>
        );
      case true:
        return <Sharing />;
      default:
        return (
          <>
            {this.renderInstructionBar()}
            {this.renderInstructionContent()}
          </>
        );
    }
  };

  renderInstructionBar = () => {
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
          }}
        >
          <Title size={'1rem'} ta={'center'}>
            Black Bean Brownies
          </Title>
          <Image src="/images/download.jpg" height={'300px'} />
          <Image src="images/image 8.png" />
          <Group justify="center" align="center">
            <IconClock />
            <Text>Estimated time: 45 minutes</Text>
          </Group>
          <Button
            color="red"
            radius={50}
            h={65}
            w={65}
            justify="center"
            style={{ alignSelf: 'center' }}
          >
            <IconMicrophone size={'2rem'} />{' '}
          </Button>
        </div>
        {/* </div> */}
      </>
    );
    <></>;
  };

  renderInstructionContent = () => {
    return (
      <>
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

export default Instruction;
