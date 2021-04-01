def _input()
	f = File.open('2020-11-input')
	# f = File.open('2020-11-test')
	a = f.read.split("\n").map { |l| ".#{l}."}
	a.unshift '.' * a[0].length
	a.push '.' * a[0].length
	a
end

a = [_input()]
a[1] = a[0].map(&:clone)

i = 0

def o?(i)
	i == '#' ? 1 : 0
end

def o1(a, x, y)
	o?(a[y-1][x-1]) + o?(a[y-1][x]) + o?(a[y-1][x+1]) + o?(a[y][x-1]) + o?(a[y][x+1]) + o?(a[y+1][x-1]) + o?(a[y+1][x]) + o?(a[y+1][x+1])
end

def o2r(a, x, y, vx, vy)
	while x > 0 && y > 0 && x < a[0].size-1 && y < a.size-1
		x += vx
		y += vy
		return 1 if a[y][x] == '#'
		return 0 if a[y][x] == 'L'
	end
	0
end

def o2(a, x, y)
	o2r(a, x, y, -1, -1) + o2r(a, x, y, 0, -1) + o2r(a, x, y, 1, -1) + o2r(a, x, y, -1, 0) + o2r(a, x, y, 1, 0) + o2r(a, x, y, -1, 1) + o2r(a, x, y, -0, 1) + o2r(a, x, y, 1, 1)
end

def iter(a, i)
	r = true
	for y in 1..a[i].size-2
		for x in 1..a[i][y].size-2
			next x if a[i][y][x] == '.'
			o = o2(a[i], x, y)
			# a[1-i][y][x] = o == 0 ? '#' : o >= 4 ? 'L' : a[i][y][x]
			a[1-i][y][x] = o == 0 ? '#' : o >= 5 ? 'L' : a[i][y][x]
			r = false if a[i][y][x] != a[1-i][y][x]
		end
	end
	r
end

iter = 0
while true
	break if iter a, i
	i = 1 - i
	iter += 1
	pp iter if iter % 1000 == 0
end

i = 1 - i
n = 0
for y in 1..a[i].size-2
	n += a[i][y].count '#'
end

pp iter, a[i], n
