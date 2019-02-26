import * as React from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import RootRef from '@material-ui/core/RootRef';

import SearchBar from './Pieces/SearchBar';
import SelectMenu from './Pieces/SelectMenu';
import FilterMenu from './Pieces/FilterMenu';
import QuarterMenu from './Pieces/QuarterMenu';
import { Filter, CourseType } from '../store/course';

export interface SortDrawerProps {
  sort: (type: CourseType) => void;
  sortKey: CourseType;
  open: boolean;
  setDrawerWidth: (val: number) => void;
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  changeQuarter: (n: number) => void;
  activeFilters: Filter[];
  search: (name: string) => void;
}
export interface SortDrawerState {
  widthRef: React.RefObject<HTMLElement>;
}

const linerWidth = 30;
const Spacer = styled.div`
  margin-top: ${linerWidth}px;
`;
const Section = styled(Card)<any>`
  margin: 0.5em 0.3em;
  padding: 0.2em;
`;

const catMap: { [K in CourseType]?: string[] } = {
  subject: [
    'ACEN',
    'AM',
    'AMS',
    'AMST',
    'ANTH',
    'APLX',
    'ARAB',
    'ART',
    'ARTG',
    'ASTR',
    'BIOC',
    'BIOE',
    'BIOL',
    'BME',
    'CHEM',
    'CHIN',
    'CLNI',
    'CLTE',
    'CMMU',
    'CMPE',
    'CMPM',
    'CMPS',
    'COWL',
    'CRES',
    'CRSN',
    'CRWN',
    'CSE',
    'CSP',
    'DANM',
    'EART',
    'ECE',
    'ECON',
    'EDUC',
    'EE',
    'ENVS',
    'ESCI',
    'ETOX',
    'FILM',
    'FMST',
    'FREN',
    'GAME',
    'GERM',
    'GREE',
    'HAVC',
    'HEBR',
    'HIND',
    'HIS',
    'HISC',
    'HUMN',
    'ITAL',
    'JAPN',
    'JWSH',
    'KRSG',
    'LAAD',
    'LALS',
    'LATN',
    'LGST',
    'LING',
    'LIT',
    'LTCR',
    'LTEL',
    'LTFR',
    'LTGE',
    'LTMO',
    'LTPR',
    'LITN',
    'LTIT',
    'LTWL',
    'MATH',
    'MERR',
    'METX',
    'MUSC',
    'OAKS',
    'OCEA',
    'PBS',
    'PHIL',
    'PHYE',
    'PHYS',
    'POLI',
    'PORT',
    'PRTR',
    'PSYC',
    'PUNJ',
    'RUSS',
    'SCIC',
    'SOCD',
    'SOCS',
    'SOCY',
    'SPAN',
    'SPHS',
    'SPSS',
    'STAT',
    'STEV',
    'THEA',
    'TIM',
    'UCDC',
    'WMST',
    'WRIT',
    'YIDD',
  ],
  level: ['Lower Div', 'Upper Div', 'Graduate'],
  ge: [
    'C',
    'C1',
    'C2',
    'CC',
    'ER',
    'IM',
    'MF',
    'PE-E',
    'PE-H',
    'PE-T',
    'PR-C',
    'PR-E',
    'PR-S',
    'SI',
    'SR',
    'TA',
  ],
  type: ['Lecture', 'Discussion', 'Field Studies', 'Laboratory', 'Seminar'],
};
const toolTip: { [K in CourseType]?: string[] } = {
  subject: [
    'Academic English',
    'Applied Mathematics',
    'Applied Math and Statistics',
    'American Studies',
    'Anthropology',
    'Applied Linguistics',
    'Arabic',
    'Art',
    'Art and Design: Games and Playable Media',
    'Astronomy and Astrophysics',
    'Biochemistry and Molecular Biology',
    'Biology: Ecology and Evolutionary',
    'Biology: Molecular, Cell and Developmental',
    'Biomolecular Engineering',
    'Chemistry',
    'Chinese',
    'College Nine',
    'College Ten',
    'Commmunity Studies',
    'Computer Engineering',
    'Computational Media',
    'Computer Science',
    'Cowell College',
    'Critical Race and Ethnics Studies',
    'Rachel Carson College',
    'Crown College',
    'Computer Science and Engineering',
    'Coastal Science and Policy',
    'Digital Arts and New Media',
    'Earth Sciences',
    'Electrical and Computer Engineering',
    'Economics',
    'Education',
    'Electrical Engineering',
    'Environmental Studies',
    'Environmental Sciences',
    'Environemtnal Toxicology',
    'Film and Digital Media',
    'Feminist Studies',
    'French',
    'Games and Playable Media',
    'German',
    'Greek',
    'History of Art and Visual Culture',
    'Hebrew',
    'Hindi',
    'History',
    'History of Consciousness',
    'Humanities',
    'Italian',
    'Japanese',
    'Jewish Studies',
    'Kresge College',
    'Languages',
    'Latin American and Latino Studies',
    'Latin',
    'Legal Studies',
    'Linguistics',
    'Literature',
    'Creative Writing',
    'English Language-Literatures',
    'French Literature',
    'German Literature',
    'Modern Literature Studies',
    'Pre-modern and Early Modern Literature',
    'Latin Literature',
    'Italian Literature',
    'World Literature and Cultural Studies',
    'Mathematics',
    'Merrill College',
    'Microbiology and Environmental Toxicology',
    'Music',
    'Oakes College',
    'Oceanography',
    'Physical and Biological Sciences',
    'Philosophy',
    'Physical Education',
    'Physics',
    'Politics',
    'Portuguese',
    'Porter College',
    'Psychology',
    'Punjabi',
    'Russian',
    'Science Communication',
    'Social Documentation',
    'Social Sciences',
    'Sociology',
    'Spanish',
    'Spanish for Heritage Speakers',
    'Spanish for Spanish Speakers',
    'Statistics',
    'Stevenson College',
    'Theatre',
    'Technology and Information Management',
    'UCDC',
    "Women's studies",
    'Writing',
    'Yiddish',
  ],
  level: [
    'Less than Course Number 100',
    'Course Number 100 to 199',
    'Course Number Greater than 200',
  ],
  ge: [
    'Composition',
    'Composition - 1',
    'Composition - 2',
    'Cross-Cultural Analysis',
    'Ethnicity and Race',
    'Interpreting Media',
    'Mathematical and Formal Reasoning',
    'Perspectives: Environmental Awareness',
    'Perspectives: Human Behaviour',
    'Perspectives: Technology and Society',
    'Practice: Creative Process',
    'Practice: Collaborative Endeavour',
    'Practice: Service Learning',
    'Scientific Inquiry',
    'Statistical Reasoning',
    'Textual Analysis',
  ],
  type: ['Lecture', 'Discussion', 'Field Studies', 'Laboratory', 'Seminar'],
};

class SortDrawer extends React.Component<SortDrawerProps, SortDrawerState> {
  state = {
    widthRef: React.createRef<HTMLElement>(),
  };
  ComponentDidMount() {
    this.props.setDrawerWidth(this.state.widthRef.current!.offsetWidth);
    console.log(this.state.widthRef.current!.offsetWidth);
    console.log('cdm');
  }
  render() {
    return (
      <RootRef rootRef={this.state.widthRef}>
        <Drawer
          open={this.props.open}
          variant="permanent"
          PaperProps={{
            style: {
              padding: '0 0.25em',
            },
          }}
        >
          <Spacer />
          <SearchBar search={this.props.search} />
          <Section>
            <CardHeader title="Sorting" />
            <SelectMenu sort={this.props.sort} sortKey={this.props.sortKey} />
          </Section>
          <Section>
            <CardHeader title="Filter" />
            {(Object.keys(catMap) as (CourseType)[]).map((category, index) => (
              <React.Fragment key={index}>
                {index !== 0 && <Divider />}
                <FilterMenu
                  addFilter={this.props.addFilter}
                  removeFilter={this.props.removeFilter}
                  category={category}
                  filterList={catMap[category] || []}
                  activeFilters={this.props.activeFilters.filter(
                    f => f.type === category
                  )}
                  toolTips={toolTip[category] || []}
                />
              </React.Fragment>
            ))}
            <QuarterMenu changeQuarter={this.props.changeQuarter} />
            {/* which quarter, default to current */}
          </Section>
        </Drawer>
      </RootRef>
    );
  }
}

export default SortDrawer;
