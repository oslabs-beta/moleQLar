import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from './About.jsx';
import { BrowserRouter} from 'react-router-dom';


const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('About page', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('About component is properly rendered to page', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    const mainHeader = screen.getByText(/We're changing the way/i);
    const homeLinkNav = screen.getByRole('link', {name: /Home/i});
    const homeLinkIcon = screen.getByAltText(/Small Logo/i);
    const teamLink = screen.getByRole('link', {name: /Team/i});
    const githubLink = screen.getByAltText(/GitHub/i);
    
    expect(mainHeader).toBeInTheDocument();
    expect(homeLinkNav).toBeInTheDocument();
    expect(homeLinkIcon).toBeInTheDocument();
    expect(teamLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
  });
});
