import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Alert,
  CssBaseline,
} from '@mui/material';
import { CloudUpload, Download, CheckCircle } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL || 'https://mark-down-container.jollymeadow-0111d26b.westus2.azurecontainerapps.io';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#64748b',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '1rem',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

function App() {
  const [file, setFile] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMarkdown('');
    setError('');
    setSuccess(false);
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess(false);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/convert`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setMarkdown('');
      } else {
        setMarkdown(data.markdown || '');
        setSuccess(true);
      }
    } catch (err) {
      setError('Error: ' + err.message);
      setMarkdown('');
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!markdown) return;

    const baseName = file?.name ? file.name.replace(/\.[^/.]+$/, '') : 'converted';
    const mdFileName = `${baseName}.md`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = mdFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 6,
          px: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: '900px',
            mx: 'auto',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Document to Markdown
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                fontSize: '1.1rem',
              }}
            >
              Convert your documents to clean, formatted Markdown instantly
            </Typography>
          </Box>

          <Card
            sx={{
              mb: 4,
              p: 4,
              border: '2px dashed #cbd5e1',
              backgroundColor: '#ffffff',
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '16px',
                  backgroundColor: '#f0f9ff',
                  mb: 3,
                }}
              >
                <CloudUpload
                  sx={{
                    fontSize: 48,
                    color: '#2563eb',
                  }}
                />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                  color: '#1e293b',
                }}
              >
                Upload Your Document
              </Typography>

              <Typography
                sx={{
                  color: '#64748b',
                  mb: 3,
                }}
              >
                Click to choose a file or drag and drop
              </Typography>

              <Button
                variant="contained"
                component="label"
                size="large"
                sx={{
                  mb: 2,
                }}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>

              {file && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#10b981' }} />
                    <Typography sx={{ color: '#15803d', fontWeight: 500 }}>
                      {file.name}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Card>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '8px',
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: '8px',
              }}
            >
              Conversion successful!
            </Alert>
          )}

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 4,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleConvert}
              disabled={!file || loading}
              sx={{
                minWidth: 200,
                position: 'relative',
              }}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{
                      mr: 1,
                    }}
                  />
                  Converting...
                </>
              ) : (
                'Convert Document'
              )}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleDownload}
              disabled={!markdown || loading}
              startIcon={<Download />}
              sx={{
                minWidth: 200,
                color: '#2563eb',
                borderColor: '#2563eb',
                '&:hover': {
                  backgroundColor: '#f0f9ff',
                  borderColor: '#1d4ed8',
                },
              }}
            >
              Download .md
            </Button>
          </Box>

          {markdown && (
            <Card
              sx={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: '#1e293b',
                    }}
                  >
                    Markdown Result
                  </Typography>
                  <Button
                    variant="text"
                    onClick={handleCopy}
                    sx={{
                      color: '#2563eb',
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box
                  component="pre"
                  sx={{
                    backgroundColor: '#f8fafc',
                    p: 3,
                    borderRadius: '8px',
                    overflow: 'auto',
                    color: '#1e293b',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    fontFamily: 'Fira Code, monospace',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  {markdown}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
